from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import firebase_admin
from firebase_admin import auth

# Inicializa Firebase si aún no está inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app()
    
class FirebaseUser:
    def __init__(self, uid):
        self.uid = uid

    @property
    def is_authenticated(self):
        return True  # Se considera autenticado si el token es válido

    def __str__(self):
        return self.uid

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            token = auth_header.split(" ").pop()
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            user = FirebaseUser(uid)  # Retorna un objeto FirebaseUser
            return (user, None)
        except Exception as e:
            raise AuthenticationFailed(f"Token inválido: {str(e)}")