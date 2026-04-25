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

data "aws_ssm_parameter" "secret_key" {
  name            = "/enerlink/dev/SECRET_KEY"
  with_decryption = true
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
    AWS_REGION = var.region
    APP_ENV    = var.environment
    SECRET_KEY   = data.aws_ssm_parameter.secret_key.value
    DATABASE_URL = var.database_url
  })

  tags = { Name = "enerlink-compute" }
}

resource "aws_eip" "enerlink_ec2_eip" {
  domain = "vpc"

  depends_on = [aws_internet_gateway.igw-enerlink]

  tags = {
    Name = "enerlink_ec2_eip"
  }
}

resource "aws_eip_association" "enerlink_ec2_eip_assoc" {
  instance_id   = aws_instance.enerlink_ec2.id
  allocation_id = aws_eip.enerlink_ec2_eip.id
}