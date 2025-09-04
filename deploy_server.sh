#!/bin/bash

# =====================================================
# NDC Conference 2025 - Server Deployment Script
# =====================================================
# This script sets up the complete server environment
# for the NDC Conference 2025 application
# =====================================================

set -e  # Exit on any error

echo "🚀 Starting NDC Conference 2025 Server Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="conf"
DB_USER="user"
DB_PASSWORD="toor"
APP_DIR="/var/www/ndc"
REPO_URL="https://github.com/peter-cyber-create/ndc-frontend.git"
DOMAIN="conference.health.go.ug"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  App Directory: $APP_DIR"
echo "  Domain: $DOMAIN"
echo ""

# =====================================================
# 1. UPDATE SYSTEM PACKAGES
# =====================================================
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# =====================================================
# 2. INSTALL REQUIRED PACKAGES
# =====================================================
echo -e "${YELLOW}📦 Installing required packages...${NC}"
sudo apt install -y \
    curl \
    wget \
    git \
    nginx \
    mysql-server \
    nodejs \
    npm \
    pm2 \
    unzip \
    software-properties-common

# =====================================================
# 3. INSTALL NODE.JS (Latest LTS)
# =====================================================
echo -e "${YELLOW}📦 Installing Node.js LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"

# =====================================================
# 4. SETUP MYSQL DATABASE
# =====================================================
echo -e "${YELLOW}🗄️  Setting up MySQL database...${NC}"

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
echo -e "${YELLOW}🔒 Securing MySQL installation...${NC}"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpassword';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='';"
sudo mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
sudo mysql -e "DROP DATABASE IF EXISTS test;"
sudo mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Create database and user
echo -e "${YELLOW}🗄️  Creating database and user...${NC}"
sudo mysql -u root -prootpassword -e "
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
"

# Run database setup script
echo -e "${YELLOW}🗄️  Setting up database schema...${NC}"
if [ -f "database/setup_complete.sql" ]; then
    mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < database/setup_complete.sql
    echo -e "${GREEN}✅ Database schema created successfully${NC}"
else
    echo -e "${RED}❌ Database setup script not found${NC}"
    exit 1
fi

# =====================================================
# 5. SETUP APPLICATION DIRECTORY
# =====================================================
echo -e "${YELLOW}📁 Setting up application directory...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# =====================================================
# 6. CLONE AND SETUP APPLICATION
# =====================================================
echo -e "${YELLOW}📥 Cloning application repository...${NC}"
cd $APP_DIR

# Remove existing directory if it exists
if [ -d "ndc-frontend" ]; then
    rm -rf ndc-frontend
fi

git clone $REPO_URL ndc-frontend
cd ndc-frontend

# Install dependencies
echo -e "${YELLOW}📦 Installing application dependencies...${NC}"
npm install

# Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# =====================================================
# 7. SETUP ENVIRONMENT VARIABLES
# =====================================================
echo -e "${YELLOW}⚙️  Setting up environment variables...${NC}"
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://$DOMAIN
NEXT_PUBLIC_SITE_URL=https://$DOMAIN
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_HOST=$DOMAIN
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
NODE_ENV=production
PORT=3000
EOF

# =====================================================
# 8. SETUP PM2 PROCESS MANAGER
# =====================================================
echo -e "${YELLOW}🔄 Setting up PM2 process manager...${NC}"

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ndc-conference',
    script: 'server.js',
    cwd: '$APP_DIR/ndc-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Create server.js file
cat > server.js << EOF
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(\`> Ready on http://\${hostname}:\${port}\`)
  })
})
EOF

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# =====================================================
# 9. SETUP NGINX REVERSE PROXY
# =====================================================
echo -e "${YELLOW}🌐 Setting up Nginx reverse proxy...${NC}"

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/ndc-conference << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    # SSL Configuration (you'll need to add your SSL certificates)
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    # For now, we'll use HTTP only
    # Remove the SSL block above and use this instead:
    listen 80;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files caching
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Uploads directory
    location /uploads/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=3600";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/ndc-conference /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# =====================================================
# 10. SETUP FIREWALL
# =====================================================
echo -e "${YELLOW}🔥 Setting up firewall...${NC}"
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# =====================================================
# 11. CREATE UPLOAD DIRECTORIES
# =====================================================
echo -e "${YELLOW}📁 Creating upload directories...${NC}"
mkdir -p public/uploads/abstracts
mkdir -p public/uploads/payment-proofs
chmod 755 public/uploads/abstracts
chmod 755 public/uploads/payment-proofs

# =====================================================
# 12. FINAL VERIFICATION
# =====================================================
echo -e "${YELLOW}🔍 Running final verification...${NC}"

# Check if services are running
echo "Checking services:"
echo "  MySQL: $(sudo systemctl is-active mysql)"
echo "  Nginx: $(sudo systemctl is-active nginx)"
echo "  PM2: $(pm2 status | grep ndc-conference | awk '{print $10}')"

# Test database connection
echo "Testing database connection:"
mysql -u $DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT 'Database connection successful' as status;"

# Test application
echo "Testing application:"
sleep 5
curl -I http://localhost:3000 || echo "Application not responding on port 3000"

# =====================================================
# DEPLOYMENT COMPLETE
# =====================================================
echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "  ✅ System packages updated"
echo "  ✅ Node.js LTS installed"
echo "  ✅ MySQL database created and configured"
echo "  ✅ Application cloned and built"
echo "  ✅ PM2 process manager configured"
echo "  ✅ Nginx reverse proxy configured"
echo "  ✅ Firewall configured"
echo "  ✅ Upload directories created"
echo ""
echo -e "${BLUE}🌐 Access Information:${NC}"
echo "  Application URL: http://$DOMAIN"
echo "  Admin Login: http://$DOMAIN/admin/login"
echo "  Admin Credentials: admin / conference2025"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "  PM2 Status: pm2 status"
echo "  PM2 Logs: pm2 logs ndc-conference"
echo "  PM2 Restart: pm2 restart ndc-conference"
echo "  Nginx Status: sudo systemctl status nginx"
echo "  MySQL Status: sudo systemctl status mysql"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "  1. Configure SSL certificates for HTTPS"
echo "  2. Update DNS records to point to this server"
echo "  3. Test all functionality"
echo "  4. Set up regular backups"
echo ""
echo -e "${GREEN}🚀 Your NDC Conference 2025 application is now live!${NC}"
