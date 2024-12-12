import boto3
import os
from io import BytesIO

def get_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        region_name=os.environ['AWS_S3_REGION_NAME'],
    )
    
def download_file_from_s3(bucket_name, s3_key):
    s3 = get_s3_client()
    file_obj = BytesIO()
    try:
        s3.download_fileobj(bucket_name, s3_key, file_obj)
        file_obj.seek(0)
        return file_obj  # Retorna el archivo como BytesIO
    except Exception as e:
        print(f"Error al descargar archivo de S3: {e}")
        return None
    
    
def upload_file_to_s3(bucket_name, s3_key, data):
    s3 = get_s3_client()
    try:
        s3.put_object(Bucket=bucket_name, Key=s3_key, Body=data)
        print(f"Archivo subido a S3: {s3_key}")
    except Exception as e:
        print(f"Error al subir archivo a S3: {e}")