# Virtual private cloud
resource "aws_vpc" "enerlink-vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

# PUBLIC subnet
resource "aws_subnet" "enerlink-public-subnet" {
  vpc_id                  = aws_vpc.enerlink-vpc.id
  cidr_block              = cidrsubnet(aws_vpc.enerlink-vpc.cidr_block, 4, 0)
  availability_zone       = var.az
  map_public_ip_on_launch = true

  tags = {
    Name = "enerlink-public-subnet"
  }
}
# Internet Gateway public
resource "aws_internet_gateway" "igw-enerlink" {
  vpc_id = aws_vpc.enerlink-vpc.id
  tags   = { Name = "igw-enerlink" }
}

# --------------------------------Route table + association
# Route Table public
resource "aws_route_table" "enerlink-rt-public" {
  vpc_id = aws_vpc.enerlink-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw-enerlink.id
  }

  tags = { Name = "enerlink-rt-public" }
}


# Association Route Table with public rt
resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.enerlink-public-subnet.id
  route_table_id = aws_route_table.enerlink-rt-public.id
}