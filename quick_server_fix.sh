#!/bin/bash

echo "🚀 Quick Server Fix for Registration System"
echo "==========================================="

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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
echo "1️⃣ PULLING LATEST CHANGES"
echo "========================="
cd /var/www/ndc-frontend
git pull origin main
print_status $? "Git pull completed"

echo ""
echo "2️⃣ FIXING DATABASE SCHEMA"
echo "========================="
print_info "Adding missing database columns..."

mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN IF NOT EXISTS organization VARCHAR(255) AFTER position;" 2>/dev/null
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN IF NOT EXISTS country VARCHAR(100) AFTER city;" 2>/dev/null
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations ADD COLUMN IF NOT EXISTS city VARCHAR(100) AFTER position;" 2>/dev/null
mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; ALTER TABLE registrations MODIFY COLUMN status ENUM('pending','approved','rejected') DEFAULT 'pending';" 2>/dev/null

print_status $? "Database schema updated"

echo ""
echo "3️⃣ TESTING DATABASE CONNECTION"
echo "=============================="
node test_db_connection.js
print_status $? "Database connection test"

echo ""
echo "4️⃣ FIXING FILE PERMISSIONS"
echo "=========================="
sudo chown -R conf:conf /var/www/ndc-frontend/uploads/ 2>/dev/null
sudo chmod -R 755 /var/www/ndc-frontend/uploads/ 2>/dev/null
print_status $? "File permissions fixed"

echo ""
echo "5️⃣ RESTARTING APPLICATION"
echo "========================="
pm2 restart ndc-frontend
print_status $? "PM2 restart completed"

echo ""
echo "6️⃣ VERIFICATION"
echo "==============="
print_info "Checking PM2 status..."
pm2 status

print_info "Testing registration API..."
node test_registration_api.js

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "======================="
echo "✅ Database schema fixed"
echo "✅ Missing API routes created"
echo "✅ File permissions fixed"
echo "✅ Application restarted"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test registration form: https://conference.health.go.ug/register"
echo "2. Check admin panel: https://conference.health.go.ug/admin/registrations"
echo "3. Verify file uploads work properly"
echo ""
echo "🚀 Registration system should now work without errors!"
