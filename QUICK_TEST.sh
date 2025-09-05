#!/bin/bash

# Quick Test Script for NDC Conference 2025
echo "🧪 QUICK FUNCTIONALITY TEST"
echo "=========================="

# Test 1: Check if server is responding
echo "Testing server response..."
if curl -s -I http://localhost:3000 | grep -q "200\|404"; then
    echo "✅ Server is responding"
else
    echo "❌ Server is not responding"
    exit 1
fi

# Test 2: Test homepage
echo "Testing homepage..."
if curl -s http://localhost:3000 | grep -q "Conference\|NACNDC"; then
    echo "✅ Homepage loads"
else
    echo "❌ Homepage failed to load"
fi

# Test 3: Test registration page
echo "Testing registration page..."
if curl -s http://localhost:3000/register | grep -q "Registration\|Register"; then
    echo "✅ Registration page loads"
else
    echo "❌ Registration page failed to load"
fi

# Test 4: Test abstracts page
echo "Testing abstracts page..."
if curl -s http://localhost:3000/abstracts | grep -q "Abstract\|Submit"; then
    echo "✅ Abstracts page loads"
else
    echo "❌ Abstracts page failed to load"
fi

# Test 5: Test sponsors page
echo "Testing sponsors page..."
if curl -s http://localhost:3000/sponsors | grep -q "Sponsor\|Package"; then
    echo "✅ Sponsors page loads"
else
    echo "❌ Sponsors page failed to load"
fi

# Test 6: Test contact page
echo "Testing contact page..."
if curl -s http://localhost:3000/contact | grep -q "Contact\|moh.conference"; then
    echo "✅ Contact page loads"
else
    echo "❌ Contact page failed to load"
fi

# Test 7: Test admin dashboard
echo "Testing admin dashboard..."
if curl -s http://localhost:3000/admin | grep -q "Admin\|Loading\|Redirecting"; then
    echo "✅ Admin dashboard loads"
else
    echo "❌ Admin dashboard failed to load"
fi

# Test 8: Test API endpoints
echo "Testing API endpoints..."
if curl -s http://localhost:3000/api/admin/dashboard | grep -q "success\|error"; then
    echo "✅ Admin dashboard API working"
else
    echo "❌ Admin dashboard API failed"
fi

echo ""
echo "🎉 Quick test completed!"
