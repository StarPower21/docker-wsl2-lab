# Usamos la imagen oficial ligera de PyTorch
FROM pytorch/pytorch:latest

# Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar las librerías de monitoreo del sistema operativo que requiere el script
RUN pip install psutil matplotlib

# Copiar el script de entrenamiento al contenedor
COPY train.py .

# Comando de ejecución por defecto
CMD ["python", "train.py"]
