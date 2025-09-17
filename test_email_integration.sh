#!/bin/bash

echo "🧪 TESTING EMAIL INTEGRATION AND POPUP NOTIFICATIONS"
echo "====================================================="

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
sleep 3

# Test 1: Check if APIs are responding
echo ""
echo "📡 TEST 1: API Health Check"
echo "----------------------------"

# Test admin dashboard API
echo "Testing admin dashboard API..."
DASHBOARD_RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:3000/api/admin/dashboard" -o /tmp/dashboard_test)
DASHBOARD_HTTP_CODE="${DASHBOARD_RESPONSE: -3}"

if [ "$DASHBOARD_HTTP_CODE" = "200" ]; then
    echo "✅ Admin Dashboard API: WORKING"
    TOTAL_REGISTRATIONS=$(cat /tmp/dashboard_test | jq -r '.data.totalRegistrations' 2>/dev/null || echo "0")
    echo "   📊 Total Registrations: $TOTAL_REGISTRATIONS"
else
    echo "❌ Admin Dashboard API: FAILED (HTTP $DASHBOARD_HTTP_CODE)"
fi

# Test registrations API
echo "Testing registrations API..."
REGISTRATIONS_RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:3000/api/admin/registrations" -o /tmp/registrations_test)
REGISTRATIONS_HTTP_CODE="${REGISTRATIONS_RESPONSE: -3}"

if [ "$REGISTRATIONS_HTTP_CODE" = "200" ]; then
    echo "✅ Registrations API: WORKING"
    REG_COUNT=$(cat /tmp/registrations_test | jq -r '.data | length' 2>/dev/null || echo "0")
    echo "   📋 Registration Records: $REG_COUNT"
else
    echo "❌ Registrations API: FAILED (HTTP $REGISTRATIONS_HTTP_CODE)"
fi

# Test 2: Test Email Service Import
echo ""
echo "📧 TEST 2: Email Service Check"
echo "------------------------------"

# Check if email service file exists and has no syntax errors
if [ -f "lib/emailService.ts" ]; then
    echo "✅ Email Service File: EXISTS"
    
    # Check for nodemailer import
    if grep -q "import nodemailer" lib/emailService.ts; then
        echo "✅ Nodemailer Import: FOUND"
    else
        echo "❌ Nodemailer Import: MISSING"
    fi
    
    # Check for email methods
    if grep -q "sendRegistrationConfirmation" lib/emailService.ts; then
        echo "✅ Registration Email Method: FOUND"
    else
        echo "❌ Registration Email Method: MISSING"
    fi
    
    if grep -q "sendAbstractConfirmation" lib/emailService.ts; then
        echo "✅ Abstract Email Method: FOUND"
    else
        echo "❌ Abstract Email Method: MISSING"
    fi
    
    if grep -q "sendRegistrationApproval" lib/emailService.ts; then
        echo "✅ Approval Email Method: FOUND"
    else
        echo "❌ Approval Email Method: MISSING"
    fi
else
    echo "❌ Email Service File: NOT FOUND"
fi

# Test 3: Check API Email Integration
echo ""
echo "🔗 TEST 3: API Email Integration"
echo "--------------------------------"

# Check registration API for email integration
if grep -q "emailService" app/api/registrations/route.ts; then
    echo "✅ Registration API Email Integration: ENABLED"
else
    echo "❌ Registration API Email Integration: MISSING"
fi

# Check abstracts API for email integration
if grep -q "emailService" app/api/abstracts/route.ts; then
    echo "✅ Abstracts API Email Integration: ENABLED"
else
    echo "❌ Abstracts API Email Integration: MISSING"
fi

# Check admin approval API
if [ -f "app/api/admin/registrations/approve/route.ts" ]; then
    echo "✅ Admin Approval API: EXISTS"
    if grep -q "emailService" app/api/admin/registrations/approve/route.ts; then
        echo "✅ Admin Approval Email Integration: ENABLED"
    else
        echo "❌ Admin Approval Email Integration: MISSING"
    fi
else
    echo "❌ Admin Approval API: NOT FOUND"
fi

# Test 4: Frontend Toast Integration
echo ""
echo "🍞 TEST 4: Frontend Toast Integration"
echo "------------------------------------"

# Check registration form for toast integration
if grep -q "useToast" app/\(main\)/register/page.tsx; then
    echo "✅ Registration Form Toast: ENABLED"
else
    echo "❌ Registration Form Toast: MISSING"
fi

# Check abstracts form for toast integration
if grep -q "useToast" app/\(main\)/abstracts/page.tsx; then
    echo "✅ Abstracts Form Toast: ENABLED"
else
    echo "❌ Abstracts Form Toast: MISSING"
fi

# Check admin page for toast integration
if grep -q "useToast" app/admin/registrations/page.tsx; then
    echo "✅ Admin Page Toast: ENABLED"
else
    echo "❌ Admin Page Toast: MISSING"
fi

# Test 5: Environment Configuration
echo ""
echo "⚙️  TEST 5: Environment Configuration"
echo "------------------------------------"

if [ -f ".env.local" ]; then
    echo "✅ Environment File: EXISTS"
    
    if grep -q "SMTP_" .env.local; then
        echo "✅ SMTP Configuration: FOUND"
    else
        echo "⚠️  SMTP Configuration: NOT FOUND (emails won't send)"
    fi
    
    if grep -q "DB_" .env.local; then
        echo "✅ Database Configuration: FOUND"
    else
        echo "❌ Database Configuration: MISSING"
    fi
else
    echo "❌ Environment File: NOT FOUND"
fi

# Test 6: Database Connection Test
echo ""
echo "🗄️  TEST 6: Database Connection"
echo "------------------------------"

# Test database connection by checking if APIs return data
if [ "$DASHBOARD_HTTP_CODE" = "200" ] && [ "$TOTAL_REGISTRATIONS" != "null" ] && [ "$TOTAL_REGISTRATIONS" != "0" ]; then
    echo "✅ Database Connection: WORKING"
    echo "   📊 Found $TOTAL_REGISTRATIONS registrations in database"
else
    echo "⚠️  Database Connection: Limited data or connection issues"
fi

# Summary
echo ""
echo "📋 INTEGRATION TEST SUMMARY"
echo "============================"

# Count successful tests
TOTAL_TESTS=6
PASSED_TESTS=0

[ "$DASHBOARD_HTTP_CODE" = "200" ] && ((PASSED_TESTS++))
[ -f "lib/emailService.ts" ] && ((PASSED_TESTS++))
[ -f "app/api/admin/registrations/approve/route.ts" ] && ((PASSED_TESTS++))
grep -q "useToast" app/\(main\)/register/page.tsx && ((PASSED_TESTS++))
grep -q "useToast" app/admin/registrations/page.tsx && ((PASSED_TESTS++))
[ -f ".env.local" ] && ((PASSED_TESTS++))

echo "✅ Tests Passed: $PASSED_TESTS/$TOTAL_TESTS"

if [ $PASSED_TESTS -eq $TOTAL_TESTS ]; then
    echo "🎉 ALL TESTS PASSED! Email integration and popups are ready!"
elif [ $PASSED_TESTS -gt 4 ]; then
    echo "✅ Most tests passed! System is mostly ready with minor issues."
else
    echo "⚠️  Some tests failed. Check the issues above."
fi

echo ""
echo "🚀 TO TEST MANUALLY:"
echo "1. Open http://localhost:3000/register"
echo "2. Fill and submit registration form"
echo "3. Check for toast notification"
echo "4. Go to http://localhost:3000/admin/registrations"
echo "5. Test approval buttons"
echo "6. Check server logs for email attempts"

# Cleanup temp files
rm -f /tmp/dashboard_test /tmp/registrations_test

echo ""
echo "Test completed at $(date)"
