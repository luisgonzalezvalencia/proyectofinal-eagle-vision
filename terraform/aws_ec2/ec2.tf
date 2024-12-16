resource "aws_instance" "django_backend" {
  ami           = "ami-0e2c8caa4b6378d8c"
  instance_type = "t2.medium"
  key_name      = "mi-clave-aws"

  user_data = templatefile("${path.module}/scripts/user_data.sh", {
    BUCKET_NAME = aws_s3_bucket.django_bucket.id
  })

  tags = {
    Name = "django-backend-with-ngrok"
  }
}
