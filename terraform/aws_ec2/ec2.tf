resource "aws_instance" "django_backend" {
  ami             = "ami-0e2c8caa4b6378d8c"
  instance_type   = "t2.medium"
  key_name        = "mi-clave-aws"
  security_groups = [aws_security_group.allow_http.name]

  root_block_device {
    volume_size = 30 # Tamaño del volumen en GB
  }

  tags = {
    Name = "backend-api"
  }

  provisioner "remote-exec" {
    inline = [
      "mkdir -p /home/ubuntu/facedetection/main",
      "mkdir -p /home/ubuntu/facedetection/neuralnetwork",
      "mkdir -p /home/ubuntu/facedetection/assets"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "../../backend-api/main/"
    destination = "/home/ubuntu/facedetection/main/"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "../../backend-api/neuralnetwork/"
    destination = "/home/ubuntu/facedetection/neuralnetwork/"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "../../backend-api/assets/"
    destination = "/home/ubuntu/facedetection/assets/"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "../../backend-api/requirements.txt"
    destination = "/home/ubuntu/facedetection/requirements.txt"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "file" {
    source      = "../../backend-api/manage.py"
    destination = "/home/ubuntu/facedetection/manage.py"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("mi-clave-aws.pem")
      host        = self.public_ip
    }
  }

  provisioner "remote-exec" {
  inline = [
    "sudo apt-get update -y",
    "sudo apt-get install -y gcc libssl-dev libbz2-dev libffi-dev zlib1g-dev liblzma-dev make wget build-essential python3-venv python3-pip",

    # Descarga y compila Python 3.11
    "cd /usr/src",
    "sudo wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz",
    "sudo tar xzf Python-3.11.0.tgz",
    "cd Python-3.11.0",
    "sudo ./configure --enable-optimizations",
    "sudo make altinstall",

    # Crea y activa el virtualenv
    "sudo apt install python3-virtualenv -y",
    "virtualenv -p python3.11 /home/ubuntu/facedetection/venv",
    "source /home/ubuntu/facedetection/venv/bin/activate",

    # Instala dependencias
    "pip install -r /home/ubuntu/facedetection/requirements.txt",

    # Ejecuta el servidor con Gunicorn
    "cd /home/ubuntu/facedetection",
    "pip install gunicorn",
    "nohup gunicorn --chdir /home/ubuntu/facedetection --bind 0.0.0.0:8000 main.wsgi:application &"
  ]

  connection {
    type        = "ssh"
    user        = "ubuntu" # O "ubuntu" si usas Ubuntu
    private_key = file("mi-clave-aws.pem")
    host        = self.public_ip
  }
}


}
