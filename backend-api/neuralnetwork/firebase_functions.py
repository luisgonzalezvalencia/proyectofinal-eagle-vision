from datetime import datetime
import os
import zipfile
import tempfile
import firebase_admin
from firebase_admin import firestore

# Inicializar Firebase si no está inicializado
if not firebase_admin._apps:
    firebase_admin.initialize_app()

# Obtener referencia a Firestore
db = firestore.client()

def add_user_client(client_id, id_user, s3_key):
    try:
         # Referencia a la colección usersClient
        users_client_ref = db.collection("usersClient")
        
        # Crear o actualizar el documento del usuario (Firestore genera automáticamente el ID)
        user_data = {
            "userId": id_user,
            "clientId": client_id,
            "createdAt": datetime.utcnow().isoformat()
        }
        user_doc_ref = users_client_ref.add(user_data)
        print(f"Documento de usuario creado con ID: {user_doc_ref[1].id}")

        # Referencia a la colección images
        images_ref = db.collection("images")

        # Crear el documento de la imagen en la colección images
        image_data = {
            "clientId": client_id,
            "userId": id_user,
            "fileName": s3_key.split('/')[-1],
            "s3Path": s3_key,
            "uploadedAt": datetime.utcnow().isoformat(),
        }
        image_doc_ref = images_ref.add(image_data)  # Firestore genera automáticamente el ID
        print(f"Documento de imagen creado con ID: {image_doc_ref[1].id}")

    except Exception as e:
        print(f"Error al agregar documento en Firestore: {e}")
