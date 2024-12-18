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
        # Crear referencia a la subcolección de imágenes
        user_doc_ref = db.collection("usersClient").document(client_id).collection("users").document(id_user)
        images_ref = user_doc_ref.collection("images")

        # Generar un nombre único para la imagen
        image_doc_id = client_id + "_" + id_user + "_" + s3_key.split('/')[-1].replace('.', '_')

        # Agregar el documento de imagen en Firestore
        images_ref.document(image_doc_id).set({
            "file_name": s3_key.split('/')[-1],
            "s3_path": s3_key,
            "uploaded_at": datetime.utcnow().isoformat(),
        })

        print(f"Imagen registrada en Firestore para client_id: {client_id}, id_user: {id_user}")

    except Exception as e:
        print(f"Error al agregar documento en Firestore: {e}")