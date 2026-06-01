import threading
import time

# Consumo de CPU: hilos en bucle infinito
def consumir_cpu():
    while True:
        pass

# Consumo de RAM: lista que crece indefinidamente
def consumir_ram():
    datos = []
    while True:
        datos.append(' ' * 10**6)  # agrega ~1MB por iteración
        time.sleep(0.1)

# Lanzar hilos
hilos_cpu = [threading.Thread(target=consumir_cpu) for _ in range(2)]
hilo_ram = threading.Thread(target=consumir_ram)

for h in hilos_cpu:
    h.start()
hilo_ram.start()
