output "droplet_ip" {
  description = "Dirección IP pública del Droplet"
  value       = digitalocean_droplet.django_droplet.ipv4_address
}
