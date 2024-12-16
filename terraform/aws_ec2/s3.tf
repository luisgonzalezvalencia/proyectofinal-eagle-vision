resource "aws_s3_bucket" "django_bucket" {
  bucket = "django-backend-${random_string.bucket_suffix.result}"
  acl    = "private"

  tags = {
    Name = "DjangoBackendBucket"
  }
}

resource "random_string" "bucket_suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "aws_s3_bucket_object" "backend_files" {
  bucket = aws_s3_bucket.django_bucket.id
  for_each = fileset("../backend-api", "**/*")
  key      = each.value
  source   = "${path.root}/../backend-api/${each.value}"
  etag     = filemd5("${path.root}/../backend-api/${each.value}") # para verificar cambios en archivos
  acl      = "private"
}

output "bucket_name" {
  value = aws_s3_bucket.django_bucket.bucket
}
