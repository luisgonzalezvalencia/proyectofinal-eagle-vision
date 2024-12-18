from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
import firebase_admin
from firebase_admin import firestore

# Inicializa Firebase si aún no está inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app()
    
class FirebaseUserSDK:
    def __init__(self, clientId):
        self.clientId = clientId

    @property
    def is_authenticated(self):
        return True  # Se considera autenticado si el token es válido

    def __str__(self):
        return self.clientId

db = firestore.client()
class FirebaseAuthenticationSDK(BaseAuthentication):
    def authenticate(self, request):
        # Obtener el Bearer Token desde el encabezado Authorization
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Token inválido o no proporcionado")

        token = auth_header.split(" ")[1]  # Extraer el token después de "Bearer"

        # Buscar el cliente en Firestore
        try:
            clients_ref = db.collection("clients")
            query = clients_ref.where("token", "==", token).stream()

            # Procesar resultados
            client_data = None
            for doc in query:
                client_data = doc.to_dict()
                client_data['id'] = doc.id  # Añadir el ID del documento si es necesario
                break  # Solo necesitamos el primer resultado

            if not client_data:
                raise AuthenticationFailed("Token no válido o expirado")
            
            user = FirebaseUserSDK(client_data.get("clientId"))  # Retorna un objeto FirebaseUserSDK
            return (user, None)

        except Exception as e:
            raise AuthenticationFailed(f"Error al verificar el token: {str(e)}")