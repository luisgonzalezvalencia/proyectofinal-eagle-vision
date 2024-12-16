# Crear un Droplet en DigitalOcean
resource "digitalocean_droplet" "django_droplet" {
  name   = var.droplet_name
  region = var.region
  size   = var.size
  image  = var.image
  ssh_keys = [digitalocean_ssh_key.default.id]

  tags = ["django", "backend"]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y python3-pip python3-venv nginx git

              # Crear una app de Django
              mkdir -p /srv/django
              cd /srv/django
              python3 -m venv venv
              source venv/bin/activate
              pip install django gunicorn

              # Clonar el repositorio de tu backend
              git clone https://github.com/luisgonzalezvalencia/proyectofinal-eagle-vision .
              pip install -r requirements.txt

              # Configurar Gunicorn
              cat <<EOG > /etc/systemd/system/gunicorn.service
              [Unit]
              Description=Gunicorn instance to serve Django app
              After=network.target

              [Service]
              User=root
              WorkingDirectory=/srv/django
              ExecStart=/srv/django/venv/bin/gunicorn --workers 3 --bind unix:/srv/django/django.sock backend.wsgi:application

              [Install]
              WantedBy=multi-user.target
              EOG

              systemctl start gunicorn
              systemctl enable gunicorn

              # Configurar NGINX
              cat <<EON > /etc/nginx/sites-available/django
              server {
                  listen 80;
                  server_name ${digitalocean_droplet.django_droplet.ipv4_address};

                  location / {
                      include proxy_params;
                      proxy_pass http://unix:/srv/django/django.sock;
                  }
              }
              EON

              ln -s /etc/nginx/sites-available/django /etc/nginx/sites-enabled
              nginx -t
              systemctl restart nginx
              EOF
}

# Configurar SSH Key
resource "digitalocean_ssh_key" "default" {
  name       = "ssh_key"
  public_key = file("~/.ssh/id_rsa.pub") # Asegúrate de tener esta clave SSH creada
}

# Firewall (opcional)
resource "digitalocean_firewall" "django_firewall" {
  name = "django-firewall"

  inbound_rule {
    protocol   = "tcp"
    port_range = "22"
    source_addresses = ["0.0.0.0/0"]
  }

  inbound_rule {
    protocol   = "tcp"
    port_range = "80"
    source_addresses = ["0.0.0.0/0"]
  }

  outbound_rule {
    protocol   = "tcp"
    port_range = "all"
    destination_addresses = ["0.0.0.0/0"]
  }

  droplet_ids = [digitalocean_droplet.django_droplet.id]
}
