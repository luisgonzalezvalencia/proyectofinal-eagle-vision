output "public_ip" {
  value = aws_instance.django_backend.public_ip
}
