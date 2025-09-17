#!/bin/bash

echo "Testing NDC Frontend APIs..."
echo "========================================="

echo "1. Testing Dashboard API:"
curl -s "http://localhost:3000/api/admin/dashboard" | jq '.success, .data.totalRegistrations, .data.totalAbstracts' 2>/dev/null || echo "Dashboard API Error"

echo -e "\n2. Testing Registrations API:"
curl -s "http://localhost:3000/api/admin/registrations" | jq '.success, (.data | length)' 2>/dev/null || echo "Registrations API Error"

echo -e "\n3. Testing Abstracts API:"
curl -s "http://localhost:3000/api/admin/abstracts" | jq '.success, (.data | length)' 2>/dev/null || echo "Abstracts API Error"

echo -e "\n4. Testing Database Direct:"
mysql -u user -ptoor -e "USE conf; SELECT COUNT(*) as registrations FROM registrations; SELECT COUNT(*) as abstracts FROM abstracts;" 2>/dev/null || echo "Database connection error"

echo -e "\nTest completed!"
