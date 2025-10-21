#!/bin/bash

# NACNDC & JASHConference 2025 - Deployment Script
# This script deploys the Next.js application to production

set -e  # Exit on any error

echo "🚀 Starting deployment of NACNDC & JASHConference 2025..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ndc-conference"
APP_DIR="/var/www/ndc/ndc-frontend"
BACKUP_DIR="/var/www/backups"
NGINX_CONFIG="/etc/nginx/sites-available/ntlp-conference.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/ntlp-conference.conf"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Step 2: Build the application
print_status "Building the application..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please fix the errors and try again."
    exit 1
fi

print_success "Application built successfully!"

# Step 3: Create backup
print_status "Creating backup..."
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -d "$APP_DIR" ]; then
    print_status "Backing up existing application..."
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$(dirname $APP_DIR)" "$(basename $APP_DIR)" 2>/dev/null || true
    print_success "Backup created: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
fi

# Step 4: Deploy to production directory
print_status "Deploying to production directory..."
sudo mkdir -p "$(dirname $APP_DIR)"
sudo cp -r . "$APP_DIR/"
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"

# Step 5: Install production dependencies
print_status "Installing production dependencies..."
cd "$APP_DIR"
sudo -u www-data npm ci --production

# Step 6: Configure Nginx
print_status "Configuring Nginx..."
if [ -f "$NGINX_CONFIG" ]; then
    sudo ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        print_success "Nginx configuration updated and reloaded"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
else
    print_warning "Nginx configuration file not found at $NGINX_CONFIG"
fi

# Step 7: Start/restart PM2
print_status "Managing PM2 processes..."
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

print_success "PM2 process started successfully!"

# Step 8: Health check
print_status "Performing health check..."
sleep 5

# Check if the application is running
if pm2 list | grep -q "$APP_NAME.*online"; then
    print_success "Application is running successfully!"
else
    print_error "Application failed to start. Check PM2 logs: pm2 logs $APP_NAME"
    exit 1
fi

# Step 9: Display deployment information
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  • Application: $APP_NAME"
echo "  • Directory: $APP_DIR"
echo "  • Backup: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
echo "  • PM2 Status: $(pm2 list | grep $APP_NAME | awk '{print $10}')"
echo ""
echo "🔧 Useful Commands:"
echo "  • View logs: pm2 logs $APP_NAME"
echo "  • Restart app: pm2 restart $APP_NAME"
echo "  • Stop app: pm2 stop $APP_NAME"
echo "  • Monitor: pm2 monit"
echo ""
echo "🌐 Your application should be accessible at your configured domain!"

# Step 10: Cleanup (optional)
read -p "Do you want to clean up build artifacts? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Cleaning up build artifacts..."
    rm -rf .next
    print_success "Build artifacts cleaned up!"
fi

print_success "Deployment script completed!"



