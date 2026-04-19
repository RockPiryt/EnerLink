# COMPUTE (paid)

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}


locals {
  app_env = var.environment

  database_url = var.environment == "production" ? (
    "postgresql://${var.db_user}:${var.db_password}@${aws_db_instance.preg_postgres.address}:5432/${var.db_name}?sslmode=require"
  ) : ""
}

# EC2 (public)
resource "aws_instance" "enerlink_ec2" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3a.medium"
  associate_public_ip_address = false
  subnet_id                   = aws_subnet.enerlink-public-subnet.id

  vpc_security_group_ids = [aws_security_group.enerlink_ec2_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_node_profile.name
  user_data_replace_on_change = true

  user_data = templatefile("${path.module}/scripts/run_app.sh", {
    MASTER_TLS_SAN                = "127.0.0.1"
    AWS_REGION                    = var.region
    
    APP_ENV      = local.app_env
    DATABASE_URL = local.database_url
    SECRET_KEY   = var.secret_key
  })

  tags = { Name = "enerlink-compute" }
}

resource "aws_eip" "enerlink_ec2_eip" {
  domain = "vpc"

  tags = {
    Name = "enerlink_ec2_eip"
  }
}

resource "aws_eip_association" "enerlink_ec2_eip_assoc" {
  instance_id   = aws_instance.enerlink_ec2.id
  allocation_id = aws_eip.enerlink_ec2_eip.id
}