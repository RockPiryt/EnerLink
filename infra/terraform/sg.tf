# -------------------------Security group for ec2
resource "aws_security_group" "enerlink_ec2_sg" {
  name        = "enerlink-instance"
  description = "Security group for enerlink instance"
  vpc_id      = aws_vpc.enerlink-vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow outbound internet access. Required for Docker Hub pulls, OS updates, etc.
  egress {
    description = "Allow outbound traffic to the internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "enerlink-instance" }
}