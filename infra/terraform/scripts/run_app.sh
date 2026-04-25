#!/bin/bash
set -e

export DEBIAN_FRONTEND=noninteractive

apt-get update -y
apt-get install -y ca-certificates curl gnupg lsb-release git

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

export SECRET_KEY=$(aws ssm get-parameter \
  --name "${SECRET_KEY}" \
  --with-decryption \
  --query "Parameter.Value" \
  --output text \
  --region "${AWS_REGION}")

mkdir -p /opt/enerlink
cd /opt/enerlink

if [ ! -d EnerLink ]; then
  git clone https://github.com/RockPiryt/EnerLink.git
fi

cd EnerLink

cat > .env <<EOF
APP_ENV=${APP_ENV}
DATABASE_URL=${DATABASE_URL}
SECRET_KEY=${SECRET_KEY}
EOF

mkdir -p /opt/enerlink/data

docker compose -f docker-compose.prod.yaml up -d --build

sleep 10

docker exec enerlink-backend flask db upgrade
docker exec enerlink-backend python seed_database.py