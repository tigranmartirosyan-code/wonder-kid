#!/bin/bash
set -e

# ============================================
# Wonder Kid - AWS Deployment Script
# ============================================
# Fill in your credentials below, then run:
#   chmod +x deploy.sh
#   ./deploy.sh
# ============================================

# ---------- YOUR CREDENTIALS ----------
AWS_ACCOUNT_ID="CHANGE_ME"
AWS_REGION="us-east-1"
AWS_ACCESS_KEY="CHANGE_ME"
AWS_SECRET_KEY="CHANGE_ME"
DB_PASSWORD="postgres"
EC2_INSTANCE_TYPE="t2.micro"
AMI_ID="ami-0c7217cdde317cfec"  # Ubuntu 22.04 us-east-1
KEY_NAME="wonder-kid-key"
SG_NAME="wonder-kid-sg"
# --------------------------------------

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Validate credentials are filled
if [ "$AWS_ACCESS_KEY" = "CHANGE_ME" ] || [ "$AWS_SECRET_KEY" = "CHANGE_ME" ] || [ "$AWS_ACCOUNT_ID" = "CHANGE_ME" ]; then
  err "Please fill in your AWS credentials at the top of this script before running."
fi

# Step 1: Configure AWS CLI
log "Configuring AWS CLI..."
aws configure set aws_access_key_id "$AWS_ACCESS_KEY"
aws configure set aws_secret_access_key "$AWS_SECRET_KEY"
aws configure set default.region "$AWS_REGION"
aws configure set default.output json
log "AWS CLI configured."

# Step 2: Create key pair
log "Creating key pair: $KEY_NAME..."
if aws ec2 describe-key-pairs --key-names "$KEY_NAME" 2>/dev/null; then
  log "Key pair already exists, skipping."
else
  aws ec2 create-key-pair --key-name "$KEY_NAME" --query 'KeyMaterial' --output text > "${KEY_NAME}.pem"
  chmod 400 "${KEY_NAME}.pem"
  log "Key pair saved to ${KEY_NAME}.pem"
fi

# Step 3: Create security group
log "Creating security group: $SG_NAME..."
SG_ID=$(aws ec2 describe-security-groups --group-names "$SG_NAME" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)

if [ -z "$SG_ID" ] || [ "$SG_ID" = "None" ]; then
  SG_ID=$(aws ec2 create-security-group --group-name "$SG_NAME" --description "Wonder Kid Server" --query 'GroupId' --output text)
  log "Security group created: $SG_ID"

  # Open ports: SSH, HTTP, HTTPS, NestJS, PostgreSQL
  for PORT in 22 80 443 3000 5432; do
    aws ec2 authorize-security-group-ingress --group-id "$SG_ID" --protocol tcp --port "$PORT" --cidr 0.0.0.0/0
    log "Opened port $PORT"
  done
else
  log "Security group already exists: $SG_ID"
fi

# Step 4: Launch EC2 instance
log "Launching EC2 instance..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id "$AMI_ID" \
  --instance-type "$EC2_INSTANCE_TYPE" \
  --key-name "$KEY_NAME" \
  --security-group-ids "$SG_ID" \
  --count 1 \
  --query 'Instances[0].InstanceId' \
  --output text)
log "Instance launched: $INSTANCE_ID"

# Step 5: Wait for instance to be running
log "Waiting for instance to be running..."
aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"
log "Instance is running."

# Step 6: Get public IP
EC2_IP=$(aws ec2 describe-instances --instance-ids "$INSTANCE_ID" --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)
log "EC2 Public IP: $EC2_IP"

# Step 7: Wait for SSH to be ready
log "Waiting for SSH to be ready..."
sleep 30
for i in {1..10}; do
  if ssh -i "${KEY_NAME}.pem" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ubuntu@"$EC2_IP" "echo ok" 2>/dev/null; then
    break
  fi
  log "Retrying SSH... ($i/10)"
  sleep 10
done

# Step 8: Dump local database
log "Dumping local PostgreSQL database..."
PGPASSWORD="$DB_PASSWORD" pg_dump -h 127.0.0.1 -U postgres test > wonder-kid-dump.sql
log "Database dumped to wonder-kid-dump.sql"

# Step 9: Copy dump and project to EC2
log "Copying files to EC2..."
scp -i "${KEY_NAME}.pem" -o StrictHostKeyChecking=no wonder-kid-dump.sql ubuntu@"$EC2_IP":~/
log "Database dump copied."

# Step 10: Setup server (PostgreSQL, Node.js, app)
log "Setting up server..."
ssh -i "${KEY_NAME}.pem" -o StrictHostKeyChecking=no ubuntu@"$EC2_IP" bash -s "$DB_PASSWORD" << 'REMOTE_SCRIPT'
set -e
DB_PASS=$1

# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Configure PostgreSQL
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "CREATE DATABASE test;" 2>/dev/null || true

# Allow remote connections
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf
echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
sudo systemctl restart postgresql

# Restore database dump
sudo -u postgres psql test < ~/wonder-kid-dump.sql

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Configure Nginx reverse proxy
sudo tee /etc/nginx/sites-available/wonder-kid > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/wonder-kid /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "Server setup complete!"
REMOTE_SCRIPT

# Step 11: Deploy the app
log "Deploying Wonder Kid app..."
rsync -avz -e "ssh -i ${KEY_NAME}.pem -o StrictHostKeyChecking=no" \
  --exclude node_modules --exclude .git --exclude dist \
  ./ ubuntu@"$EC2_IP":~/wonder-kid/

ssh -i "${KEY_NAME}.pem" -o StrictHostKeyChecking=no ubuntu@"$EC2_IP" bash << 'APP_SCRIPT'
set -e
cd ~/wonder-kid

# Create .env
cat > .env << ENV
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=test
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=wonder-kid-secret-2026
ENV

# Install dependencies and build
npm install
npm run build

# Start with PM2
pm2 delete wonder-kid 2>/dev/null || true
pm2 start dist/main.js --name wonder-kid
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash

echo "App deployed and running!"
APP_SCRIPT

log "============================================"
log "  DEPLOYMENT COMPLETE!"
log "============================================"
log "  EC2 IP:       $EC2_IP"
log "  App URL:      http://$EC2_IP"
log "  SSH:          ssh -i ${KEY_NAME}.pem ubuntu@$EC2_IP"
log "  Console:      https://${AWS_ACCOUNT_ID}.signin.aws.amazon.com/console"
log "============================================"
log "  Database: PostgreSQL on EC2 (port 5432)"
log "  Connect: psql -h $EC2_IP -U postgres -d test"
log "============================================"

# Cleanup
rm -f wonder-kid-dump.sql
