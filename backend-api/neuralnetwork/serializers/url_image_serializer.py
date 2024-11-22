
from rest_framework import serializers
from neuralnetwork.models import UserImage

class UserImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserImage
        fields = ['client_id', 'user_id', 'image']