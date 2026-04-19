# -------------------------Security group for ec2
resource "aws_security_group" "enerlink_ec2_sg" {
  name        = "enerlink-instance"
  description = "Security group for enerlink instance"
  vpc_id      = aws_vpc.enerlink-vpc.id

  # Allow full traffic between nodes inside the same SG
  ingress {
    description = "Node-to-node communication within K3s cluster"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  # Allow outbound internet access (via NAT Gateway). Required for Docker Hub pulls, OS updates, etc.
  egress {
    description = "Allow outbound traffic to the internet"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "enerlink-instance" }
}