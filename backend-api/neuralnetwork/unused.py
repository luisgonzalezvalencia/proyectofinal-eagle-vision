import os
import zipfile
import boto3
from requests import Response
from rest_framework import status


def upload_zip_client(self, request, *args, **kwargs):
        # Obtener el archivo ZIP
        client_id = request.data.get('client_id')
        zip_file = request.FILES.get('zip_file')

        if not client_id or not zip_file:
            return Response({"error": "client_id y zip_file son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            s3 = boto3.client(
                's3',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
                region_name=os.environ['AWS_S3_REGION_NAME'],
            )
            # Abre el archivo ZIP en memoria
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                for file_name in zip_ref.namelist():
                    if file_name.endswith('/'):
                        continue  # Ignorar directorios

                    # Leer el archivo del ZIP
                    file_data = zip_ref.read(file_name)

                    # Crear la clave en S3 (client_id + ruta dentro del ZIP)
                    s3_key = f"{client_id}/{file_name}"

                    # Subir el archivo a S3
                    s3.put_object(
                        Bucket=os.environ['AWS_STORAGE_BUCKET_NAME'],
                        Key=s3_key,
                        Body=file_data
                    )
                return Response({"message": "Todos los archivos del ZIP se subieron correctamente."}, status=status.HTTP_201_CREATED)

        except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)