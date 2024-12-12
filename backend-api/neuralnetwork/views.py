import json
import os
import tempfile
import threading
import zipfile
import boto3
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets
from django.db.models import Q
from django.core.paginator import Paginator

from neuralnetwork.dataprocess.dataprocess import readImages
from neuralnetwork.dataprocess.implementation import retornar_presentes, runTest
from PIL import Image
from rest_framework.parsers import MultiPartParser, FormParser
from neuralnetwork.serializers.url_image_serializer import UserImageSerializer

# Create your views here.
class NeuralNetworkViewSet(viewsets.ViewSet):
    parser_classes = (MultiPartParser, FormParser,)
    # self: class instance
    # request: http request object with some transformations and params
    def get(self, request):
        try:
            # data = readImages()

            testExecution = runTest()
            return HttpResponse(testExecution, content_type='image/png')
            # return Response(
            #     {"message": "success"}, status=status.HTTP_200_OK
            # )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


    def post(self, request):
        try:
            # Obtener el archivo de la solicitud
            file = request.FILES['file']
            image = Image.open(file)
            if image.mode == 'RGBA':
                image = image.convert('RGB')

            testExecution = runTest(image)
            return HttpResponse(testExecution, content_type='image/png')
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


    def get_presentes_del_dia(self, request):
        try:
            presentes = json.dumps(retornar_presentes(), indent=4) if retornar_presentes() else '[]'
            #retornar json de presentes
            return HttpResponse(presentes, content_type='application/json')
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


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
            s3_key = f'{client_id}/users/{user_id}/{image.name}'

            # Subir a S3
            try:
                s3.upload_fileobj(image.file, os.environ['AWS_STORAGE_BUCKET_NAME'], s3_key)

                # TODO: Agregar usersClient en firebase si no existe
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
                    if file_name.endswith('/'):
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

                    # TODO: Agregar usersClient en firebase si no existe


            print("Subida completada.")
            # TODO: Actualizar background tasks

        except Exception as e:
            print(f"Error al procesar el archivo ZIP: {e}")
        finally:
            # Eliminar el archivo temporal
            if os.path.exists(zip_file_path):
                os.remove(zip_file_path)