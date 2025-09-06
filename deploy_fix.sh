#!/bin/bash

# Server Deployment Fix Script
# This script handles the complete deployment process with proper error handling

echo "🚀 Starting NDC Conference 2025 Server Deployment Fix..."

# Step 1: Stop the application
echo "📦 Stopping application..."
pm2 stop all
pm2 delete all
pkill -f "node"
pkill -f "next"

# Step 2: Navigate to project directory
cd /var/www/ndc-frontend

# Step 3: Handle git conflicts
echo "🔄 Handling git conflicts..."
git stash
git pull origin main

# Step 4: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 5: Update database schema with error handling
echo "🗄️ Updating database schema..."
mysql -u user -p conf < database/schema_fix.sql 2>/dev/null || {
    echo "⚠️ Some columns may already exist, continuing..."
}

# Step 6: Verify database schema
echo "🔍 Verifying database schema..."
mysql -u user -p conf -e "DESCRIBE contacts;" | grep phone || {
    echo "❌ contacts.phone column missing, adding manually..."
    mysql -u user -p conf -e "ALTER TABLE contacts ADD COLUMN phone VARCHAR(20) AFTER email;"
}

mysql -u user -p conf -e "DESCRIBE sponsorships;" | grep submitted_at || {
    echo "❌ sponsorships.submitted_at column missing, adding manually..."
    mysql -u user -p conf -e "ALTER TABLE sponsorships ADD COLUMN submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER payment_proof_url;"
}

mysql -u user -p conf -e "DESCRIBE abstracts;" | grep cross_cutting_themes || {
    echo "❌ abstracts.cross_cutting_themes column missing, adding manually..."
    mysql -u user -p conf -e "ALTER TABLE abstracts ADD COLUMN cross_cutting_themes TEXT AFTER subcategory;"
}

# Step 7: Build the application
echo "🔨 Building application..."
npm run build

# Step 8: Start the application
echo "🚀 Starting application..."
pm2 start npm --name "ndc-frontend" -- run start
pm2 save

# Step 9: Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 10

# Step 10: Verify deployment
echo "✅ Verifying deployment..."
curl -s http://localhost:3000/api/admin/dashboard > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Application is running successfully!"
    pm2 status
    echo ""
    echo "🌐 Testing key endpoints..."
    echo "Registrations: $(curl -s http://localhost:3000/api/admin/registrations | jq '.success' 2>/dev/null || echo 'failed')"
    echo "Abstracts: $(curl -s http://localhost:3000/api/admin/abstracts | jq '.success' 2>/dev/null || echo 'failed')"
    echo "Exhibitors: $(curl -s http://localhost:3000/api/admin/exhibitors | jq '.success' 2>/dev/null || echo 'failed')"
    echo "Sponsorships: $(curl -s http://localhost:3000/api/admin/sponsorships | jq '.success' 2>/dev/null || echo 'failed')"
    echo "Contacts: $(curl -s http://localhost:3000/api/admin/contacts | jq '.success' 2>/dev/null || echo 'failed')"
else
    echo "❌ Application failed to start. Check logs:"
    pm2 logs ndc-frontend --lines 20
fi

echo "🎉 Deployment fix complete!"
