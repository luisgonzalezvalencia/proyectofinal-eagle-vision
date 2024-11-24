from rest_framework import serializers

class UserImageSerializer(serializers.Serializer):
    client_id = serializers.IntegerField()
    user_id = serializers.CharField()
    image = serializers.ImageField()