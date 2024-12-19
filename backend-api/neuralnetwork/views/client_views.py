import os
import tempfile
import threading
import zipfile
import boto3
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from rest_framework.parsers import MultiPartParser, FormParser
from neuralnetwork.firebase_functions import add_user_client
from neuralnetwork.serializers.url_image_serializer import UserImageSerializer
from neuralnetwork.dataprocess.implementation import training_data

# Create your views here.
class ClientViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    # self: class instance
    # request: http request object with some transformations and params


    def upload_image_data(self, request, *args, **kwargs):
        serializer = UserImageSerializer(data=request.data)
        if serializer.is_valid():
            # Extraer datos validados
            client_id = serializer.validated_data['client_id']
            user_id = serializer.validated_data['user_id']
            image = serializer.validated_data['image']


            # Conectar a S3
            s3 = boto3.client(
                's3',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
                region_name=os.environ['AWS_S3_REGION_NAME'],
            )

            # Generar la ruta en S3
            s3_key = f'{client_id}/{user_id}/{image.name}'

            # Subir a S3
            try:
                s3.upload_fileobj(image.file, os.environ['AWS_STORAGE_BUCKET_NAME'], s3_key)

                # Agregar usersClient en firebase si no existe
                add_user_client(client_id, user_id, s3_key)
                
                return Response({"message": "Imagen subida correctamente", "s3_key": s3_key}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def upload_zip_client(self, request, *args, **kwargs):
        # Obtener el archivo ZIP
        client_id = request.data.get('client_id')
        zip_file = request.FILES.get('zip_file')

        if not client_id or not zip_file:
            return Response({"error": "client_id y zip_file son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Guardar temporalmente el archivo ZIP
            temp_dir = tempfile.gettempdir()
            zip_file_path = os.path.join(temp_dir, zip_file.name)

            with open(zip_file_path, 'wb') as temp_file:
                for chunk in zip_file.chunks():
                    temp_file.write(chunk)

            # Ejecutar la subida en un hilo separado

            # TODO: Generar background task y iniciar thread con ese id

            thread = threading.Thread(target=self.process_zip_upload, args=(client_id, zip_file_path))
            thread.start()

            return Response({"message": "El archivo está siendo procesado en segundo plano."}, status=status.HTTP_202_ACCEPTED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def init_training_manually(self, request, *args, **kwargs):
        client_id = request.data.get('client_id')
        if not client_id:
            return Response({"error": "client_id es requerido."}, status=status.HTTP_400_BAD_REQUEST)

        client_trained = training_data(client_id)
        if client_trained:
            return Response({"message": "Entrenamiento realizado."}, status=status.HTTP_200_OK)

        return Response({"error": "Hubo un problema en el entrenamiento. Intente nuevamente."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

    # TODO: Agregar task id para poder consultar el estado de la subida
    def process_zip_upload(self, client_id, zip_file_path):
        #TODO: Implementar la subida en segundo plano con un sistema de log para ir controlando el proceso
        s3 = boto3.client(
                's3',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
                region_name=os.environ['AWS_S3_REGION_NAME'],
        )

        try:
            # Abrir y procesar el archivo ZIP
            with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
                for file_name in zip_ref.namelist():
                    if file_name.endswith('/') or "MACOSX" in file_name:
                        continue  # Ignorar directorios

                    # Leer el archivo del ZIP
                    file_data = zip_ref.read(file_name)

                    # Crear la clave en S3
                    s3_key = f"{client_id}/{file_name}"

                    # Subir el archivo a S3
                    s3.put_object(
                        Bucket=os.environ['AWS_STORAGE_BUCKET_NAME'],
                        Key=s3_key,
                        Body=file_data
                    )
                    user_id = file_name.split('/')[0]
                    # Agregar usersClient en firebase si no existe
                    add_user_client(client_id, user_id, s3_key)


            print("Subida completada.")
            # TODO: Actualizar background tasks

        except Exception as e:
            print(f"Error al procesar el archivo ZIP: {e}")
        finally:
            # Eliminar el archivo temporal
            if os.path.exists(zip_file_path):
                os.remove(zip_file_path)