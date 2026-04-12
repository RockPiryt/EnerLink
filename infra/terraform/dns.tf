# Route 53 domain
data "aws_route53_zone" "pk_domain" {
  name         = "paulinakimak.com"
  private_zone = false
}

# Route 53 record (subdomain enerlink.paulinakimak.com)
resource "aws_route53_record" "enerlink_app" {
  zone_id = data.aws_route53_zone.pk_domain.zone_id
  name    = "enerlink"
  type    = "A"
  ttl     = 300
  records = [aws_eip.enerlink_ec2_eip.public_ip]
}