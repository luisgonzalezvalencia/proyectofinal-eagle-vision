from django.urls import path
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
from rest_framework import permissions

from neuralnetwork.views import NeuralNetworkViewSet


# schema_view = get_schema_view(
#     openapi.Info(
#         title="ClassGather API",
#         default_version='1'
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny],
# )

data = NeuralNetworkViewSet.as_view({'get':'get', 'post':'post'})
uploadImage = NeuralNetworkViewSet.as_view({'post':'upload_image_data'})

urlpatterns = [
    path("check", data),
    path("get_presentes_del_dia", NeuralNetworkViewSet.as_view({'get':'get_presentes_del_dia'})),
    path('upload-image/', uploadImage),
    # path('neuralnetwork/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
