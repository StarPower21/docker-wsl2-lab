#!/bin/bash

# Configuración del test de estrés
WORKERS=15      # Número de procesos concurrentes (hilos de ataque)
DURATION=20     # Duración del ataque en segundos
URL_BASE="http://localhost:3001/api"  # Apunta al nuevo puerto 3001

echo "================================================================"
echo " INICIANDO TEST DE ESTRÉS SOBRE EL SISTEMA OPERATIVO CONTROLADO "
echo " Concurrencia (Workers): $WORKERS | Duración: $DURATION segundos "
echo "================================================================"

# Archivos temporales para contabilizar métricas de rendimiento
TEMP_DIR=$(mktemp -d)
echo 0 > "$TEMP_DIR/success"
echo 0 > "$TEMP_DIR/errors"

# Función interna que ejecutará cada hilo de trabajo independiente (Proceso Hijo)
run_worker() {
    local end_time=$((SECONDS + DURATION))
    local endpoints=("/cpu-intensive" "/heavy-query" "/massive-write")
    
    while [ $SECONDS -lt $end_time ]; do
        # Selección aleatoria de la petición para simular un comportamiento caótico real
        local target=${endpoints[$RANDOM % ${#endpoints[@]}]}
        
        # Realizamos la petición HTTP midiendo el código de estado devuelto
        local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$URL_BASE$target")
        
        if [ "$response_code" -eq 200 ]; then
            echo $(( $(cat "$TEMP_DIR/success") + 1 )) > "$TEMP_DIR/success"
        else
            echo $(( $(cat "$TEMP_DIR/errors") + 1 )) > "$TEMP_DIR/errors"
        fi
    done
}

# Línea de tiempo de inicio
START_TIME=$SECONDS

# Creación dinámica de procesos paralelos concurrentes utilizando el operador background '&' del SO
for ((i=1; i<=WORKERS; i++)); do
    run_worker &
done

# Monitoreo en tiempo real mientras duren los procesos en background
while [ $((SECONDS - START_TIME)) -lt $DURATION ]; do
    sleep 1
    CURRENT_SUCCESS=$(cat "$TEMP_DIR/success" 2>/dev/null || echo 0)
    CURRENT_ERRORS=$(cat "$TEMP_DIR/errors" 2>/dev/null || echo 0)
    TOTAL_REQ=$((CURRENT_SUCCESS + CURRENT_ERRORS))
    ELAPSED=$((SECONDS - START_TIME))
    
    if [ $ELAPSED -gt 0 ]; then
        REQ_PER_SEC=$((TOTAL_REQ / ELAPSED))
        echo "Métricas actuales -> Tiempo: ${ELAPSED}s | Peticiones Totales: $TOTAL_REQ | Req/seg: $REQ_PER_SEC | Errores: $CURRENT_ERRORS"
    fi
done

# Esperar de forma segura a que todos los subprocesos terminen su ciclo de vida
wait

# Resultados Finales Consolidados
FINAL_SUCCESS=$(cat "$TEMP_DIR/success")
FINAL_ERRORS=$(cat "$TEMP_DIR/errors")
FINAL_TOTAL=$((FINAL_SUCCESS + FINAL_ERRORS))
FINAL_RPS=$((FINAL_TOTAL / DURATION))

echo "================================================================"
echo " TEST DE ESTRÉS COMPLETADO "
echo "================================================================"
echo " Total Peticiones Procesadas : $FINAL_TOTAL"
echo " Peticiones Exitosas (200 OK): $FINAL_SUCCESS"
echo " Peticiones Fallidas         : $FINAL_ERRORS"
echo " Rendimiento Medio del Servidor: $FINAL_RPS req/seg"
echo "================================================================"

# Limpieza absoluta de descriptores y archivos en el sistema de archivos temporal
rm -rf "$TEMP_DIR"
