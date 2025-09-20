#!/bin/bash

# Test script for NACNDC & JASHConference 2025
# This script tests all functionality to ensure everything is working

echo "🧪 Testing NACNDC & JASHConference 2025 Application"
echo "=============================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test results
print_test() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Check if database is accessible
echo "1. Testing database connection..."
mysql -u user -ptoor conf -e "SELECT 1;" > /dev/null 2>&1
print_test $? "Database connection"

# Test 2: Check if tables exist
echo "2. Testing database tables..."
mysql -u user -ptoor conf -e "SHOW TABLES;" | grep -q "registrations" && \
mysql -u user -ptoor conf -e "SHOW TABLES;" | grep -q "abstracts" && \
mysql -u user -ptoor conf -e "SHOW TABLES;" | grep -q "contacts" && \
mysql -u user -ptoor conf -e "SHOW TABLES;" | grep -q "sponsorships"
print_test $? "Database tables exist"

# Test 3: Check if sample data exists
echo "3. Testing sample data..."
REGISTRATIONS=$(mysql -u user -ptoor conf -e "SELECT COUNT(*) FROM registrations;" -s -N)
ABSTRACTS=$(mysql -u user -ptoor conf -e "SELECT COUNT(*) FROM abstracts;" -s -N)
CONTACTS=$(mysql -u user -ptoor conf -e "SELECT COUNT(*) FROM contacts;" -s -N)
SPONSORSHIPS=$(mysql -u user -ptoor conf -e "SELECT COUNT(*) FROM sponsorships;" -s -N)

if [ "$REGISTRATIONS" -gt 0 ] && [ "$ABSTRACTS" -gt 0 ] && [ "$CONTACTS" -gt 0 ] && [ "$SPONSORSHIPS" -gt 0 ]; then
    print_test 0 "Sample data exists (Registrations: $REGISTRATIONS, Abstracts: $ABSTRACTS, Contacts: $CONTACTS, Sponsorships: $SPONSORSHIPS)"
else
    print_test 1 "Sample data missing"
fi

# Test 4: Check if application builds
echo "4. Testing application build..."
npm run build > /dev/null 2>&1
print_test $? "Application builds successfully"

# Test 5: Check if development server starts
echo "5. Testing development server..."
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5
if ps -p $SERVER_PID > /dev/null; then
    print_test 0 "Development server starts"
    kill $SERVER_PID 2>/dev/null
else
    print_test 1 "Development server failed to start"
fi

# Test 6: Check if all required files exist
echo "6. Testing file structure..."
[ -f "app/(main)/page.tsx" ] && \
[ -f "app/(main)/register/page.tsx" ] && \
[ -f "app/(main)/abstracts/page.tsx" ] && \
[ -f "app/(main)/contact/page.tsx" ] && \
[ -f "app/(main)/sponsors/page.tsx" ] && \
[ -f "app/admin/dashboard/page.tsx" ] && \
[ -f "app/admin/registrations/page.tsx" ] && \
[ -f "app/admin/abstracts/page.tsx" ] && \
[ -f "app/admin/contacts/page.tsx" ] && \
[ -f "app/admin/sponsorships/page.tsx" ] && \
[ -f "components/CountdownTimer.tsx" ] && \
[ -f "components/Toast.tsx" ] && \
[ -f "hooks/useToast.ts" ] && \
[ -f "database/schema.sql" ] && \
[ -f "README.md" ] && \
[ -f "deploy.sh" ]
print_test $? "All required files exist"

# Test 7: Check TypeScript compilation
echo "7. Testing TypeScript compilation..."
npx tsc --noEmit > /dev/null 2>&1
print_test $? "TypeScript compilation"

# Test 8: Check if environment variables are set
echo "8. Testing environment configuration..."
[ -f ".env" ] && grep -q "DB_USER=user" .env && grep -q "DB_PASSWORD=toor" .env && grep -q "DB_NAME=conf" .env
print_test $? "Environment variables configured"

echo ""
echo "🎉 Testing completed!"
echo "===================="
echo "Your NACNDC & JASHConference 2025 application is ready!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
echo "To deploy:"
echo "  ./deploy.sh"
echo ""
echo "Application will be available at: http://localhost:3000"



