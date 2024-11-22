from django.db import models

# Create your models here.
class UserImage(models.Model):
    client_id = models.UUIDField()  # ID del cliente
    user_id = models.UUIDField()    # ID del usuario
    image = models.ImageField(upload_to='')  # Sin subdirectorios

    def save(self, *args, **kwargs):
        # Modifica la ruta de almacenamiento
        self.image.name = f'{self.client_id}/users/{self.user_id}/{self.image.name}'
        super().save(*args, **kwargs)