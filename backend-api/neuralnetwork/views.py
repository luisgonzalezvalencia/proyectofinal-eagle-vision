import json
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
            serializer.save()
            return Response({
                'message': 'Image uploaded successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)