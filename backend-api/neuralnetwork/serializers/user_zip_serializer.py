from rest_framework import serializers

class UserZipSerializer(serializers.Serializer):
    client_id = serializers.IntegerField()
    zip_file = serializers.FileField()  # Archivo ZIP