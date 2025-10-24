#!/bin/bash

echo "🔧 FIXING REGISTRATION SYSTEM"
echo "============================="
echo ""

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

echo "Step 1: Starting Database Service"
echo "=================================="

# Try to start MariaDB/MySQL
if command -v systemctl >/dev/null 2>&1; then
    if systemctl is-active --quiet mariadb; then
        print_status 0 "MariaDB is already running"
    elif systemctl is-active --quiet mysql; then
        print_status 0 "MySQL is already running"
    else
        print_info "Starting database service..."
        if sudo systemctl start mariadb 2>/dev/null; then
            print_status 0 "MariaDB started successfully"
        elif sudo systemctl start mysql 2>/dev/null; then
            print_status 0 "MySQL started successfully"
        else
            print_status 1 "Failed to start database service"
            echo "Please run manually: sudo systemctl start mariadb"
        fi
    fi
else
    print_info "systemctl not available, trying service command..."
    if service mysql start 2>/dev/null; then
        print_status 0 "MySQL started successfully"
    elif service mariadb start 2>/dev/null; then
        print_status 0 "MariaDB started successfully"
    else
        print_status 1 "Failed to start database service"
    fi
fi

echo ""
echo "Step 2: Testing Database Connection"
echo "==================================="

# Test database connection
if mysql -h 127.0.0.1 -u user -ptoor -e "SELECT 1;" 2>/dev/null; then
    print_status 0 "Database connection successful"
    
    # Check if database exists
    if mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SELECT 1;" 2>/dev/null; then
        print_status 0 "Database 'conf' exists"
        
        # Check if registrations table exists
        if mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; DESCRIBE registrations;" 2>/dev/null; then
            print_status 0 "Registrations table exists"
        else
            print_status 1 "Registrations table does not exist"
            print_info "Creating registrations table..."
            
            mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; CREATE TABLE IF NOT EXISTS registrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(100) NOT NULL,
                lastName VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                position VARCHAR(100) NOT NULL,
                country VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                registrationType VARCHAR(50) NOT NULL,
                paymentProofUrl VARCHAR(500),
                passportPhotoUrl VARCHAR(500),
                status VARCHAR(20) DEFAULT 'pending',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );" 2>/dev/null
            
            if [ $? -eq 0 ]; then
                print_status 0 "Registrations table created successfully"
            else
                print_status 1 "Failed to create registrations table"
            fi
        fi
    else
        print_status 1 "Database 'conf' does not exist"
        print_info "Creating database..."
        mysql -h 127.0.0.1 -u user -ptoor -e "CREATE DATABASE IF NOT EXISTS conf;" 2>/dev/null
        if [ $? -eq 0 ]; then
            print_status 0 "Database 'conf' created successfully"
        else
            print_status 1 "Failed to create database"
        fi
    fi
else
    print_status 1 "Cannot connect to database"
    echo "Please check your database credentials in .env.local"
fi

echo ""
echo "Step 3: Testing Registration System"
echo "===================================="

# Test the registration system
print_info "Testing registration system..."
node test_db_connection.js

echo ""
echo "Step 4: Final Verification"
echo "=========================="

# Run the comprehensive diagnostic
print_info "Running comprehensive system check..."
./DIAGNOSE_REGISTRATION_ISSUES.sh

echo ""
echo "🎯 SUMMARY"
echo "=========="
echo ""
echo "If you see any ❌ errors above, please:"
echo ""
echo "1. For database issues:"
echo "   sudo systemctl start mariadb"
echo "   sudo systemctl enable mariadb"
echo ""
echo "2. For missing database/tables:"
echo "   ./setup_database.sh"
echo ""
echo "3. For API issues:"
echo "   Check the browser console and server logs"
echo ""
echo "4. Test the registration form at:"
echo "   http://localhost:3000/register"
echo ""
echo "5. Use the test page:"
echo "   http://localhost:3000/test_registration_fix.html"
echo ""

print_info "Registration system should now be working!"
