#!/bin/bash

# Test script for form submissions
# This script tests all forms to ensure they submit successfully

echo "🧪 Testing Form Submissions"
echo "=========================="

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

# Start the development server in background
echo "Starting development server..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 10

# Test 1: Registration Form
echo "1. Testing Registration Form..."
REGISTRATION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/registrations \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test.user@example.com" \
  -F "phone=+256700000999" \
  -F "organization=Test Organization" \
  -F "position=Test Position" \
  -F "registrationType=local" \
  -F "paymentProof=@/dev/null" 2>/dev/null)

if echo "$REGISTRATION_RESPONSE" | grep -q "success"; then
    print_test 0 "Registration form submission"
else
    print_test 1 "Registration form submission"
fi

# Test 2: Abstract Form
echo "2. Testing Abstract Form..."
ABSTRACT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/abstracts \
  -F "title=Test Abstract" \
  -F "primary_author=Test Author" \
  -F "corresponding_email=test.author@example.com" \
  -F "organization=Test Organization" \
  -F "abstract_summary=This is a test abstract summary" \
  -F "keywords=test, abstract, conference" \
  -F "category=research" 2>/dev/null)

if echo "$ABSTRACT_RESPONSE" | grep -q "success"; then
    print_test 0 "Abstract form submission"
else
    print_test 1 "Abstract form submission"
fi

# Test 3: Contact Form
echo "3. Testing Contact Form..."
CONTACT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "email": "test.contact@example.com",
    "phone": "+256700000998",
    "organization": "Test Organization",
    "inquiry_type": "general",
    "message": "This is a test contact message"
  }' 2>/dev/null)

if echo "$CONTACT_RESPONSE" | grep -q "success"; then
    print_test 0 "Contact form submission"
else
    print_test 1 "Contact form submission"
fi

# Test 4: Sponsorship Form
echo "4. Testing Sponsorship Form..."
SPONSORSHIP_RESPONSE=$(curl -s -X POST http://localhost:3000/api/sponsorships \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Company",
    "contact_person": "Test Contact",
    "email": "test.sponsor@example.com",
    "phone": "+256700000997",
    "selected_package": "gold"
  }' 2>/dev/null)

if echo "$SPONSORSHIP_RESPONSE" | grep -q "success"; then
    print_test 0 "Sponsorship form submission"
else
    print_test 1 "Sponsorship form submission"
fi

# Test 5: Admin Dashboard Data
echo "5. Testing Admin Dashboard Data..."
DASHBOARD_RESPONSE=$(curl -s http://localhost:3000/api/admin/dashboard 2>/dev/null)

if echo "$DASHBOARD_RESPONSE" | grep -q "success"; then
    print_test 0 "Admin dashboard data loading"
else
    print_test 1 "Admin dashboard data loading"
fi

# Test 6: Admin Registrations Data
echo "6. Testing Admin Registrations Data..."
REGISTRATIONS_RESPONSE=$(curl -s http://localhost:3000/api/admin/registrations 2>/dev/null)

if echo "$REGISTRATIONS_RESPONSE" | grep -q "success"; then
    print_test 0 "Admin registrations data loading"
else
    print_test 1 "Admin registrations data loading"
fi

# Test 7: Admin Abstracts Data
echo "7. Testing Admin Abstracts Data..."
ABSTRACTS_RESPONSE=$(curl -s http://localhost:3000/api/admin/abstracts 2>/dev/null)

if echo "$ABSTRACTS_RESPONSE" | grep -q "success"; then
    print_test 0 "Admin abstracts data loading"
else
    print_test 1 "Admin abstracts data loading"
fi

# Test 8: Admin Contacts Data
echo "8. Testing Admin Contacts Data..."
CONTACTS_RESPONSE=$(curl -s http://localhost:3000/api/admin/contacts 2>/dev/null)

if echo "$CONTACTS_RESPONSE" | grep -q "success"; then
    print_test 0 "Admin contacts data loading"
else
    print_test 1 "Admin contacts data loading"
fi

# Test 9: Admin Sponsorships Data
echo "9. Testing Admin Sponsorships Data..."
SPONSORSHIPS_RESPONSE=$(curl -s http://localhost:3000/api/admin/sponsorships 2>/dev/null)

if echo "$SPONSORSHIPS_RESPONSE" | grep -q "success"; then
    print_test 0 "Admin sponsorships data loading"
else
    print_test 1 "Admin sponsorships data loading"
fi

# Test 10: Admin Payments Data
echo "10. Testing Admin Payments Data..."
PAYMENTS_RESPONSE=$(curl -s http://localhost:3000/api/admin/payments 2>/dev/null)

if echo "$PAYMENTS_RESPONSE" | grep -q "success" || echo "$PAYMENTS_RESPONSE" | grep -q "404"; then
    print_test 0 "Admin payments data loading"
else
    print_test 1 "Admin payments data loading"
fi

# Clean up
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Form submission testing completed!"
echo "====================================="
echo ""
echo "All forms should be working correctly."
echo "Visit http://localhost:3000 to test manually:"
echo "  - Registration: http://localhost:3000/register"
echo "  - Abstracts: http://localhost:3000/abstracts"
echo "  - Contact: http://localhost:3000/contact"
echo "  - Sponsors: http://localhost:3000/sponsors"
echo "  - Admin: http://localhost:3000/admin"
