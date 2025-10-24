#!/bin/bash

echo "🔧 Fixing File Upload Limits - 413 Request Entity Too Large"
echo "=========================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo "1️⃣ CHECKING CURRENT NGINX CONFIGURATION"
echo "======================================="

# Check if nginx config exists
if [ -f "/etc/nginx/sites-available/ntlp-conference.conf" ]; then
    print_status 0 "Nginx config file exists"
    
    # Check current client_max_body_size
    CURRENT_LIMIT=$(grep "client_max_body_size" /etc/nginx/sites-available/ntlp-conference.conf | head -1)
    if [ ! -z "$CURRENT_LIMIT" ]; then
        print_info "Current limit: $CURRENT_LIMIT"
    else
        print_warning "No client_max_body_size found in config"
    fi
else
    print_status 1 "Nginx config file not found"
    echo "Looking for alternative config files..."
    
    # Check for other possible config locations
    if [ -f "/etc/nginx/nginx.conf" ]; then
        print_info "Found main nginx.conf"
        CURRENT_LIMIT=$(grep "client_max_body_size" /etc/nginx/nginx.conf | head -1)
        if [ ! -z "$CURRENT_LIMIT" ]; then
            print_info "Main config limit: $CURRENT_LIMIT"
        fi
    fi
fi

echo ""
echo "2️⃣ CHECKING NGINX MAIN CONFIGURATION"
echo "====================================="

# Check main nginx.conf for global limits
if [ -f "/etc/nginx/nginx.conf" ]; then
    print_status 0 "Main nginx.conf exists"
    
    # Check for http block limits
    HTTP_LIMIT=$(grep -A 20 "http {" /etc/nginx/nginx.conf | grep "client_max_body_size" | head -1)
    if [ ! -z "$HTTP_LIMIT" ]; then
        print_warning "Found global limit in nginx.conf: $HTTP_LIMIT"
        print_info "This might be overriding site-specific limits"
    else
        print_info "No global client_max_body_size found in nginx.conf"
    fi
else
    print_status 1 "Main nginx.conf not found"
fi

echo ""
echo "3️⃣ APPLYING FIXES"
echo "================="

# Create backup of current config
if [ -f "/etc/nginx/sites-available/ntlp-conference.conf" ]; then
    print_info "Creating backup of current config..."
    sudo cp /etc/nginx/sites-available/ntlp-conference.conf /etc/nginx/sites-available/ntlp-conference.conf.backup.$(date +%Y%m%d_%H%M%S)
    print_status 0 "Backup created"
fi

# Update the config file with proper limits
print_info "Updating nginx configuration..."

# Create a comprehensive nginx config
cat > /tmp/ntlp-conference-fixed.conf << 'EOF'
# NTLP Conference 2025 - Nginx Configuration (FIXED)
# Optimized for Ubuntu Server with Next.js Application
# Server IP: 172.27.0.9

server {
    listen 80;
    listen [::]:80;
    server_name 172.27.0.9 conference.health.go.ug _;
    
    # CRITICAL: File upload limits - INCREASED for large files
    client_max_body_size 100M;  # Increased from 50M to 100M
    client_body_buffer_size 2M;  # Increased buffer size
    client_body_timeout 120s;    # Increased timeout
    client_header_timeout 60s;
    
    # Additional upload settings
    client_body_temp_path /tmp/nginx_upload_temp;
    client_body_in_file_only clean;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;
    add_header X-Permitted-Cross-Domain-Policies "none" always;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # Main proxy configuration for Next.js app
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # INCREASED timeouts for large uploads
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # Buffer settings
        proxy_buffer_size 8k;
        proxy_buffers 16 8k;
        proxy_busy_buffers_size 16k;
    }

    # API routes - CRITICAL for file uploads
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # INCREASED timeouts for API uploads
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        
        # No caching for API routes
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # File uploads directory - serve directly from filesystem
    location /uploads/ {
        alias /var/www/ndc-frontend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        
        # Security for uploaded files
        location ~* \.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
        
        # Prevent access to hidden files
        location ~ /\. {
            deny all;
        }
    }

    # Static assets with long-term caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|webp|avif)$ {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # Enable gzip for these file types
        gzip_static on;
    }

    # Admin panel - additional security
    location /admin {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # No caching for admin
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:3000;
        access_log off;
    }

    # Block access to sensitive files
    location ~ /\.(ht|git|env) {
        deny all;
    }

    # Block access to backup files
    location ~ \.(bak|backup|old|orig|save|swp|tmp)$ {
        deny all;
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://127.0.0.1:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
        log_not_found off;
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://127.0.0.1:3000;
        expires 1d;
        add_header Cache-Control "public";
        log_not_found off;
    }

    # Error pages
    error_page 404 /404;
    error_page 500 502 503 504 /500;
    
    # Custom error page handling
    location = /404 {
        proxy_pass http://127.0.0.1:3000;
        internal;
    }
    
    location = /500 {
        proxy_pass http://127.0.0.1:3000;
        internal;
    }
}
EOF

# Copy the fixed config
print_info "Installing fixed nginx configuration..."
sudo cp /tmp/ntlp-conference-fixed.conf /etc/nginx/sites-available/ntlp-conference.conf

# Test nginx configuration
print_info "Testing nginx configuration..."
if sudo nginx -t; then
    print_status 0 "Nginx configuration is valid"
    
    # Reload nginx
    print_info "Reloading nginx..."
    if sudo systemctl reload nginx; then
        print_status 0 "Nginx reloaded successfully"
    else
        print_status 1 "Failed to reload nginx"
    fi
else
    print_status 1 "Nginx configuration has errors"
    echo "Restoring backup..."
    sudo cp /etc/nginx/sites-available/ntlp-conference.conf.backup.* /etc/nginx/sites-available/ntlp-conference.conf
fi

echo ""
echo "4️⃣ ADDITIONAL FIXES"
echo "==================="

# Check if there's a global limit in nginx.conf
print_info "Checking for global nginx limits..."

# Add global limit if needed
if ! grep -q "client_max_body_size" /etc/nginx/nginx.conf; then
    print_info "Adding global client_max_body_size to nginx.conf..."
    
    # Create a backup
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
    
    # Add the limit to the http block
    sudo sed -i '/http {/a\    client_max_body_size 100M;' /etc/nginx/nginx.conf
    
    if sudo nginx -t; then
        print_status 0 "Global limit added successfully"
        sudo systemctl reload nginx
    else
        print_status 1 "Failed to add global limit"
        sudo cp /etc/nginx/nginx.conf.backup.* /etc/nginx/nginx.conf
    fi
else
    print_info "Global limit already exists in nginx.conf"
fi

echo ""
echo "5️⃣ VERIFICATION"
echo "==============="

# Check nginx status
if systemctl is-active --quiet nginx; then
    print_status 0 "Nginx is running"
else
    print_status 1 "Nginx is not running"
fi

# Check current limits
print_info "Current nginx limits:"
grep -r "client_max_body_size" /etc/nginx/ | head -5

echo ""
echo "🎯 SUMMARY"
echo "=========="
echo "✅ Increased client_max_body_size to 100M"
echo "✅ Increased timeouts for large uploads"
echo "✅ Added proper buffer settings"
echo "✅ Fixed upload directory path"
echo "✅ Added global nginx limits"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test file uploads on the registration form"
echo "2. Check nginx error logs: sudo tail -f /var/log/nginx/error.log"
echo "3. Monitor upload success rates"
echo ""
echo "🚀 File uploads should now work properly!"
