#!/bin/bash

# Server Deployment Script
# This script handles the complete deployment process including git conflicts

echo "🚀 Starting server deployment..."

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

# Step 5: Update database schema
echo "🗄️ Updating database schema..."
mysql -u user -p conf < database/schema_update.sql

# Step 6: Build the application
echo "🔨 Building application..."
npm run build

# Step 7: Start the application
echo "🚀 Starting application..."
pm2 start npm --name "ndc-frontend" -- run start
pm2 save

# Step 8: Verify deployment
echo "✅ Verifying deployment..."
sleep 5
curl -s http://localhost:3000/api/admin/dashboard > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Application is running successfully!"
    pm2 status
else
    echo "❌ Application failed to start. Check logs:"
    pm2 logs ndc-frontend --lines 20
fi

echo "🎉 Deployment complete!"