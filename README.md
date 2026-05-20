# Entorno Docker con WSL2

## Descripción del proyecto

Este proyecto implementa un entorno de desarrollo basado en contenedores Docker utilizando WSL2 y Ubuntu sobre Windows.

El entorno incluye:

- Nginx
- Node.js con Express
- PostgreSQL
- pgAdmin 4
- Jupyter Lab

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

## Verificación de versiones

### WSL

```bash
wsl --version
```

### Docker

```bash
docker --version
```

### Docker Compose

```bash
docker compose version
```

### Git

```bash
git --version
```

---

## Estructura del proyecto

```text
docker-lab/
│
├── docker-compose.yml
├── .env
├── README.md
├── screenshots/
├── nginx/
├── node-app/
└── volumes/
```

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

---

## Servicios del entorno

| Servicio | Puerto |
|---|---|
| Nginx | 80 |
| Node.js | 3000 |
| PostgreSQL | 5432 |
| pgAdmin | 5050 |
| Jupyter Lab | 8888 |

---

## API REST Node.js

Endpoint:

```text
http://localhost/api/estudiantes
```

Respuesta JSON esperada:

```json
[
  {
    "id": 1,
    "nombre": "Dayan",
    "edad": 20
  }
]
```

---

## PostgreSQL

### Acceso desde pgAdmin

Host:

```text
postgres
```

Usuario:

```text
admin
```

---

## Jupyter Lab

Acceso:

```text
http://localhost:8888
```

---

## Comandos Docker utilizados

### Ver contenedores

```bash
docker ps
```

### Ver logs

```bash
docker logs pgadmin4
```

### Acceder a contenedor

```bash
docker exec -it postgres-db psql -U admin -d laboratorio
```

### Ver redes

```bash
docker network ls
```

### Ver volúmenes

```bash
docker volume ls
```

---

## Evidencias

Las capturas del funcionamiento del entorno se encuentran en la carpeta:

```text
screenshots/
```

---

## Problemas comunes

### Error de permisos en pgAdmin

Solución:

```bash
sudo chmod -R 777 ~/docker-lab/volumes/pgadmin-data
```

---

## Autor

Dayan Stefany Marulanda Pulido
