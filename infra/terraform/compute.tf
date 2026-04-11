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
  subnet_id                   = aws_subnet.preg-public-subnet-a.id

  vpc_security_group_ids = [aws_security_group.k3s_nodes_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_node_profile.name
  user_data_replace_on_change = true

  user_data = templatefile("${path.module}/scripts/run_app.sh", {
    MASTER_TLS_SAN                = "127.0.0.1"
    AWS_REGION                    = var.region
    ECR_CREDENTIAL_PROVIDER_VER   = var.ecr_credential_provider_ver
    
    APP_ENV      = local.app_env
    DATABASE_URL = local.database_url
    SECRET_KEY   = var.secret_key

    RDS_ENDPOINT = aws_db_instance.preg_postgres.address
    DB_PORT      = 5432
  })

  tags = { Name = "enerlink-compute" }
}

# RDS PostgreSQL
resource "aws_db_instance" "preg_postgres" {
  identifier        = "preg-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = var.db_name
  username = var.db_user
  password = var.db_password

  publicly_accessible = false
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.preg_rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.preg_db_subnet_group.name

  backup_retention_period = 0 # dev only

  tags = {
    Name = "preg-postgres"
  }
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