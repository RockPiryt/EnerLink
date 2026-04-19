variable "region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "az" {
  description = "AWS Availability Zone"
  type        = string
  default     = "eu-west-1a"
}

variable "database_url" {
  description = "Application database URL"
  type        = string
  default     = "sqlite:////data/enerlink.db"
}

variable "secret_key" {
  description = "Application secret key"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "App environment"
  type        = string
  default     = "production"
}
