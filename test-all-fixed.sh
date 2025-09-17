#!/bin/bash

echo "Testing NDC Frontend APIs..."
echo "========================================="

# Wait for server to be ready
sleep 3

# Test 1: Dashboard API
echo "1. Testing Dashboard API:"
DASHBOARD_RESPONSE=$(curl -s "http://localhost:3000/api/admin/dashboard")
if echo "$DASHBOARD_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo "✅ Dashboard API working"
    echo "   Total Registrations: $(echo "$DASHBOARD_RESPONSE" | jq '.data.totalRegistrations')"
    echo "   Total Abstracts: $(echo "$DASHBOARD_RESPONSE" | jq '.data.totalAbstracts')"
else
    echo "❌ Dashboard API failed"
fi
echo ""

# Test 2: Registrations API
echo "2. Testing Registrations API:"
REG_RESPONSE=$(curl -s "http://localhost:3000/api/admin/registrations")
if echo "$REG_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    REG_COUNT=$(echo "$REG_RESPONSE" | jq '.data | length')
    echo "✅ Registrations API working"
    echo "   Found $REG_COUNT registrations"
    if [ "$REG_COUNT" -gt 0 ]; then
        echo "   First registration: $(echo "$REG_RESPONSE" | jq -r '.data[0].firstName + " " + .data[0].lastName')"
    fi
else
    echo "❌ Registrations API failed"
fi
echo ""

# Test 3: Abstracts API
echo "3. Testing Abstracts API:"
ABS_RESPONSE=$(curl -s "http://localhost:3000/api/admin/abstracts")
if echo "$ABS_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    ABS_COUNT=$(echo "$ABS_RESPONSE" | jq '.data | length')
    echo "✅ Abstracts API working"
    echo "   Found $ABS_COUNT abstracts"
else
    echo "❌ Abstracts API failed"
fi
echo ""

# Test 4: Database Direct Check
echo "4. Testing Database Direct:"
mysql -u user -ptoor -e "USE conf; SELECT COUNT(*) as registrations FROM registrations; SELECT COUNT(*) as abstracts FROM abstracts;" 2>/dev/null
echo ""

# Test 5: Admin Dashboard Page
echo "5. Testing Admin Dashboard Page:"
DASH_PAGE=$(curl -s "http://localhost:3000/admin/dashboard" | grep -c "dashboard\|Dashboard")
if [ "$DASH_PAGE" -gt 0 ]; then
    echo "✅ Admin Dashboard page loading"
else
    echo "❌ Admin Dashboard page failed"
fi
echo ""

echo "Test completed!"
