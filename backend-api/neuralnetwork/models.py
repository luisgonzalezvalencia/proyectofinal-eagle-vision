# Create your models here.
class UserImage:
    def __init__(self, client_id, user_id, image):
        self.client_id = client_id
        self.user_id = user_id
        self.image = image
