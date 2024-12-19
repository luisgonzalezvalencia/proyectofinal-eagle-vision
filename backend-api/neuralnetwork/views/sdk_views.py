import base64
from io import BytesIO
import json
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import viewsets

from neuralnetwork.dataprocess.implementation import retornar_presentes, runTest, check_in_data_client
from PIL import Image
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated

from neuralnetwork.firebase_auth_sdk import FirebaseAuthenticationSDK

# Create your views here.
class SdkViewSet(viewsets.ViewSet):
    authentication_classes = [FirebaseAuthenticationSDK]
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)
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
            client_id = request.user.clientId
            base64_image = request.data.get('faceImage')
            if not client_id or not base64_image:
                return Response({"error": "Error en los datos proporcionados"}, status=status.HTTP_400_BAD_REQUEST)
            
            if "," in base64_image:
                base64_image = base64_image.split(",")[1]
                
            # Decodificar Base64 a binario
            image_parsed = base64.b64decode(base64_image)
            
            # Convertir los datos en un objeto BytesIO
            image = Image.open(BytesIO(image_parsed))
            if image.mode == 'RGBA':
                image = image.convert('RGB')

            check_in_bounding_box, identidades = check_in_data_client(image, client_id)
            return HttpResponse(identidades, content_type='application/json')
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