#!/bin/bash
# Actualización de paquetes e instalación de dependencias
sudo yum update -y
sudo yum install -y python3-pip unzip git aws-cli

# Configuración del entorno virtual
cd /home/ec2-user
python3 -m venv django_env
source django_env/bin/activate

# Descargar archivos del proyecto Django desde S3
echo "Sincronizando archivos desde S3..."
aws s3 ls s3://${BUCKET_NAME}/
aws s3 sync s3://${BUCKET_NAME}/ /home/ec2-user/backend-api

if [ $? -eq 0 ]; then
    echo "Archivos descargados exitosamente desde S3."
else
    echo "Error al sincronizar archivos desde S3" >&2
    exit 1
fi

cd /home/ec2-user/backend-api

# Instalar dependencias
pip install -r requirements.txt

# Configuración de Django
nohup python manage.py runserver 0.0.0.0:8000 &

# Instalar ngrok
wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip
unzip ngrok-stable-linux-amd64.zip
chmod +x ngrok

# Autenticación ngrok y creación de túnel
./ngrok authtoken 2q8ovWGhMlQMu1O21EE6GaxIJF6_41R6UnUyAWfu1ZouV7PUa
nohup ./ngrok http 8000 --region us &

# Guardar salida del túnel
sleep 10
curl -s http://localhost:4040/api/tunnels > ngrok_info.json