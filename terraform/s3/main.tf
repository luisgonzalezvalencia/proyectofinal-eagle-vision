provider "aws" {
  profile = "terraform-user" #perfil de AWS
  region  = "us-east-1"  # región de AWS US East (N. Virginia)
}

# Creación del bucket S3
resource "aws_s3_bucket" "eagle_vision_bucket" {
  bucket = "eagle-vision-sdk" # Nombre del bucket único en S3

  # Configuración de eliminación (evita eliminación accidental)
  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "Eagle Vision SDK Bucket"
    Environment = "Production"
  }
}

# Configuración de versionado
resource "aws_s3_bucket_versioning" "eagle_vision_bucket_versioning" {
  bucket = aws_s3_bucket.eagle_vision_bucket.bucket
  versioning_configuration {
    status = "Enabled"
  }
}

# Política para gestionar el acceso al bucket
resource "aws_s3_bucket_policy" "eagle_vision_policy" {
  bucket = aws_s3_bucket.eagle_vision_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject", "s3:PutObject"]
        Resource  = ["${aws_s3_bucket.eagle_vision_bucket.arn}/*"]
      }
    ]
  })
}
