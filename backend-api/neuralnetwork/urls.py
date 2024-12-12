from django.urls import path
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
from rest_framework import permissions

from neuralnetwork.views.client_views import ClientViewSet
from neuralnetwork.views.sdk_views import SdkViewSet


# schema_view = get_schema_view(
#     openapi.Info(
#         title="ClassGather API",
#         default_version='1'
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny],
# )

data = SdkViewSet.as_view({'get':'get', 'post':'post'})
uploadImage = ClientViewSet.as_view({'post':'upload_image_data'})
uploadZip = ClientViewSet.as_view({'post':'upload_zip_client'})

urlpatterns = [
    path("check", data),
    path('upload-image', uploadImage),
    path('upload-zip', uploadZip),
    # path('neuralnetwork/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]
