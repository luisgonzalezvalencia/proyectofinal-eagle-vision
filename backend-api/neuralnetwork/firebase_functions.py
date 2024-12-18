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
        # Referencia a la colección usersClient y documento de usuario
        user_doc_ref = db.collection("usersClient").document(id_user)

        # Crear o actualizar el documento del usuario
        user_doc_ref.set({
            "userId": id_user,
            "clientId": client_id,
            "createdAt": datetime.utcnow().isoformat()
        }, merge=True)

        # Referencia a la colección images
        images_ref = db.collection("images")

        # Generar un nombre único para el documento de la imagen
        image_doc_id = f"{id_user}_{s3_key.split('/')[-1].replace('.', '_')}"

        # Agregar el documento de imagen a la colección images
        images_ref.document(image_doc_id).set({
            "clientId": client_id,
            "userId": id_user,
            "fileName": s3_key.split('/')[-1],
            "s3Path": s3_key,
            "uploadedAt": datetime.utcnow().isoformat(),
        })

        print(f"Usuario {id_user} y su imagen {image_doc_id} registrados en Firestore correctamente.")

    except Exception as e:
        print(f"Error al agregar documento en Firestore: {e}")
