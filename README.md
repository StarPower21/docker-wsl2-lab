# Entorno Docker con WSL2

## Autor

Dayan Stefany Marulanda Pulido 202477427

## Descripción del proyecto

Este proyecto implementa un entorno de desarrollo multicontenedor utilizando Docker Compose sobre Ubuntu ejecutado en WSL2 (Windows Subsystem for Linux) desde Windows.

El objetivo principal fue construir una arquitectura modular y controlada que integrara distintos servicios ampliamente utilizados en administración de sistemas, desarrollo backend y análisis de datos.

---

## Arquitectura del entorno

El sistema fue construido usando Docker Compose para integrar múltiples servicios conectados mediante una red Docker compartida.

Servicios:

- Servidor web Nginx
- API Node.js
- PostgreSQL
- pgAdmin 4
- Jupyter Lab

---

## Requisitos previos

- Windows 10/11
- WSL2
- Ubuntu
- Docker Desktop
- Docker Compose
- Git


---

## Levantar el entorno

### Comando

```bash
docker compose up -d
```

### Verificación

```bash
docker ps
```
### Actualización del sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Verificación de Docker

```bash
docker --version
docker compose version
```

### Verificación de Git

```bash
git --version
```

### Reconstrucción de servicios

```bash
docker compose up -d --build
```

### Visualización de logs

```bash
docker logs node-app
```

### Acceso interactivo a contenedores

```bash
docker exec -it postgres-db bash
```

### Redes Docker

```bash
docker network ls
```

### Volúmenes persistentes

```bash
docker volume ls
```

### Detener servicios

```bash
docker compose down
```
---

## Servicios del entorno

El entorno está compuesto por cinco contenedores principales:

- Nginx como servidor web y proxy reverso.
- Node.js con Express como capa lógica de la aplicación.
- PostgreSQL como sistema gestor de base de datos relacional.
- pgAdmin 4 para la administración visual de PostgreSQL.
- Jupyter Lab para ejecución de notebooks y análisis interactivo.



## Evidencias de Despliegue y Verificación del Entorno

1. Estado del Clúster Local
Muestra el estado operativo global de la infraestructura basada en contenedores posterior a la ejecución del comando de orquestación.
<img width="1919" height="933" alt="Screenshot 2026-05-20 091722" src="https://github.com/user-attachments/assets/faf40c52-ac18-49da-9f55-bc4fc8f602a9" />

## 2. Capa Frontend - Servidor Web Nginx

El contenedor Nginx fue configurado como reverse proxy para redireccionar las solicitudes HTTP hacia la aplicación Node.js.

El acceso se realiza mediante `http://localhost`, utilizando el puerto 80 expuesto por Docker Compose.


<img width="1567" height="404" alt="Screenshot 2026-05-20 091823" src="https://github.com/user-attachments/assets/2971a557-04f2-48a9-80d0-f693e60ca1e0" />

## 3. Capa Lógica - API Node.js (Health Check)

Validación de la API desarrollada con Node.js y Express ejecutándose correctamente dentro del entorno Docker.

El endpoint `/api/estudiantes` responde en formato JSON obteniendo datos directamente desde PostgreSQL mediante comunicación inter-contenedor utilizando la red interna de Docker Compose.

<img width="1598" height="555" alt="Screenshot 2026-05-20 091253" src="https://github.com/user-attachments/assets/a62b794f-cf36-4035-b09a-474060996678" />

## 4. Capa de Datos - Conexión Exitosa API ↔ PostgreSQL

Validación de la comunicación entre los contenedores Node.js y PostgreSQL mediante la red interna de Docker Compose.
<img width="797" height="317" alt="image" src="https://github.com/user-attachments/assets/7d82c605-f34e-42f0-90be-d861108eda42" />

## 5. Capa Analítica - Jupyter Lab

Validación del entorno analítico Jupyter Lab ejecutándose correctamente dentro de un contenedor Docker.

Se realizó la creación y ejecución de notebooks Python desde el navegador, comprobando el funcionamiento del kernel interactivo y la persistencia de archivos mediante volúmenes Docker.
<img width="1882" height="710" alt="Screenshot 2026-05-20 091648" src="https://github.com/user-attachments/assets/e9bd87b6-2580-497f-ab9c-16ac11df83c5" />



