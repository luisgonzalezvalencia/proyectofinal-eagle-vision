variable "do_token" {
  description = "Token de acceso a DigitalOcean"
  type        = string
}

variable "region" {
  description = "Región donde se desplegará el Droplet"
  default     = "nyc3"
}

variable "droplet_name" {
  description = "Nombre del Droplet"
  default     = "django-backend"
}

variable "image" {
  description = "Imagen base del Droplet (Ubuntu 22.04 LTS)"
  default     = "ubuntu-22-04-x64"
}

variable "size" {
  description = "Tamaño del Droplet"
  default     = "s-1vcpu-1gb"
}