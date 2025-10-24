#!/bin/bash

echo "🔍 NDC Conference Registration System Diagnostics"
echo "================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
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

echo "1️⃣ CHECKING DATABASE SERVICE"
echo "============================"

# Check if MariaDB/MySQL is running
if systemctl is-active --quiet mariadb; then
    print_status 0 "MariaDB service is running"
elif systemctl is-active --quiet mysql; then
    print_status 0 "MySQL service is running"
else
    print_status 1 "Database service is not running"
    echo ""
    echo "To fix this, run:"
    echo "  sudo systemctl start mariadb"
    echo "  sudo systemctl enable mariadb"
    echo ""
fi

# Check if database exists
echo ""
echo "2️⃣ CHECKING DATABASE CONNECTION"
echo "================================"

# Try to connect to database
if mysql -h 127.0.0.1 -u user -ptoor -e "SELECT 1;" 2>/dev/null; then
    print_status 0 "Database connection successful"
    
    # Check if database exists
    if mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SELECT 1;" 2>/dev/null; then
        print_status 0 "Database 'conf' exists"
        
        # Check if registrations table exists
        if mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; DESCRIBE registrations;" 2>/dev/null; then
            print_status 0 "Registrations table exists"
            
            # Count existing registrations
            REG_COUNT=$(mysql -h 127.0.0.1 -u user -ptoor -e "USE conf; SELECT COUNT(*) FROM registrations;" 2>/dev/null | tail -n 1)
            print_info "Total registrations: $REG_COUNT"
        else
            print_status 1 "Registrations table does not exist"
            echo "To fix this, run the database setup script:"
            echo "  ./setup_database.sh"
        fi
    else
        print_status 1 "Database 'conf' does not exist"
        echo "To fix this, run:"
        echo "  mysql -h 127.0.0.1 -u user -ptoor -e 'CREATE DATABASE conf;'"
    fi
else
    print_status 1 "Cannot connect to database"
    echo "Check your database credentials in .env.local"
fi

echo ""
echo "3️⃣ CHECKING ENVIRONMENT VARIABLES"
echo "================================="

# Check .env.local file
if [ -f ".env.local" ]; then
    print_status 0 ".env.local file exists"
    
    # Check required variables
    if grep -q "DB_HOST" .env.local; then
        print_status 0 "DB_HOST is set"
    else
        print_status 1 "DB_HOST is missing"
    fi
    
    if grep -q "DB_USER" .env.local; then
        print_status 0 "DB_USER is set"
    else
        print_status 1 "DB_USER is missing"
    fi
    
    if grep -q "DB_PASSWORD" .env.local; then
        print_status 0 "DB_PASSWORD is set"
    else
        print_status 1 "DB_PASSWORD is missing"
    fi
    
    if grep -q "DB_NAME" .env.local; then
        print_status 0 "DB_NAME is set"
    else
        print_status 1 "DB_NAME is missing"
    fi
    
    if grep -q "SMTP_HOST" .env.local; then
        print_status 0 "SMTP_HOST is set"
    else
        print_status 1 "SMTP_HOST is missing"
    fi
    
    if grep -q "SMTP_PASS" .env.local; then
        print_status 0 "SMTP_PASS is set"
    else
        print_status 1 "SMTP_PASS is missing"
    fi
else
    print_status 1 ".env.local file does not exist"
    echo "Create .env.local with your database and email credentials"
fi

echo ""
echo "4️⃣ CHECKING FILE UPLOAD DIRECTORIES"
echo "===================================="

# Check upload directories
if [ -d "uploads/payment-proofs" ]; then
    print_status 0 "Payment proofs directory exists"
else
    print_status 1 "Payment proofs directory missing"
    mkdir -p uploads/payment-proofs
    print_status 0 "Created payment proofs directory"
fi

if [ -d "uploads/passport-photos" ]; then
    print_status 0 "Passport photos directory exists"
else
    print_status 1 "Passport photos directory missing"
    mkdir -p uploads/passport-photos
    print_status 0 "Created passport photos directory"
fi

echo ""
echo "5️⃣ CHECKING DEVELOPMENT SERVER"
echo "==============================="

# Check if Next.js dev server is running
if curl -s http://localhost:3000 > /dev/null; then
    print_status 0 "Development server is running on port 3000"
else
    print_status 1 "Development server is not running"
    echo "Start the server with: npm run dev"
fi

echo ""
echo "6️⃣ TESTING REGISTRATION API"
echo "============================"

# Test the registration API
if curl -s -X POST http://localhost:3000/api/registrations -H "Content-Type: application/json" -d '{"test":true}' > /dev/null; then
    print_status 0 "Registration API is responding"
else
    print_status 1 "Registration API is not responding"
fi

echo ""
echo "📋 SUMMARY & RECOMMENDATIONS"
echo "============================"
echo ""
echo "Common issues and solutions:"
echo ""
echo "1. Database not running:"
echo "   sudo systemctl start mariadb"
echo "   sudo systemctl enable mariadb"
echo ""
echo "2. Database not created:"
echo "   mysql -h 127.0.0.1 -u user -ptoor -e 'CREATE DATABASE conf;'"
echo ""
echo "3. Missing environment variables:"
echo "   Check .env.local file and ensure all required variables are set"
echo ""
echo "4. File upload issues:"
echo "   Ensure uploads/ directories exist and have proper permissions"
echo ""
echo "5. Email service issues:"
echo "   Check SMTP credentials in .env.local"
echo ""
echo "6. Development server not running:"
echo "   npm run dev"
echo ""

# Final status check
echo "🔧 QUICK FIX COMMANDS"
echo "===================="
echo ""
echo "If you need to fix everything at once, run these commands:"
echo ""
echo "# Start database service"
echo "sudo systemctl start mariadb && sudo systemctl enable mariadb"
echo ""
echo "# Create database and tables"
echo "./setup_database.sh"
echo ""
echo "# Start development server"
echo "npm run dev"
echo ""
echo "# Test registration"
echo "node test_registration_system.js"
echo ""

print_info "Run this script again after making fixes to verify everything is working"
