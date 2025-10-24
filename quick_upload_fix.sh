#!/bin/bash

echo "🚀 Quick Fix for 413 Request Entity Too Large Error"
echo "=================================================="

# Quick nginx config update
echo "Updating nginx configuration..."

# Create a simple fix
sudo tee /etc/nginx/conf.d/upload-fix.conf > /dev/null << 'EOF'
# Fix for 413 Request Entity Too Large
client_max_body_size 100M;
client_body_buffer_size 2M;
client_body_timeout 120s;
proxy_read_timeout 120s;
proxy_send_timeout 120s;
proxy_connect_timeout 120s;
EOF

echo "Testing nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx config is valid"
    echo "Reloading nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
    echo ""
    echo "🎯 FIX APPLIED!"
    echo "File uploads should now work with up to 100MB files"
else
    echo "❌ Nginx config error - reverting..."
    sudo rm /etc/nginx/conf.d/upload-fix.conf
    echo "Reverted changes"
fi
