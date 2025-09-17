#!/bin/bash

echo "🧪 Testing Toast Notifications"
echo "=============================="

# Test the toast test page
echo "1. Testing toast test page..."
curl -s "http://localhost:3000/toast-test" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Toast test page accessible"
else
    echo "❌ Toast test page not accessible"
fi

# Test the registration page
echo "2. Testing registration page..."
curl -s "http://localhost:3000/register" > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Registration page accessible"
else
    echo "❌ Registration page not accessible"
fi

# Test a form submission to trigger toast
echo "3. Testing form submission API..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "http://localhost:3000/api/registrations" \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "email=test@toast.com" \
  -F "phone=1234567890" \
  -F "institution=Test Institution" \
  -F "position=Developer" \
  -F "country=Uganda" \
  -F "city=Kampala" \
  -F "registrationType=local" \
  -F "paymentProof=@README.md" \
  -o /tmp/form_response)

HTTP_CODE="${RESPONSE: -3}"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Form submission successful (HTTP 200)"
    RESPONSE_MESSAGE=$(cat /tmp/form_response | jq -r '.message' 2>/dev/null || echo "No message field")
    echo "📧 Response message: $RESPONSE_MESSAGE"
else
    echo "❌ Form submission failed (HTTP $HTTP_CODE)"
    cat /tmp/form_response 2>/dev/null || echo "No response body"
fi

echo ""
echo "🎯 Manual Testing Instructions:"
echo "1. Open http://localhost:3000/toast-test"
echo "2. Click the test buttons to see if toasts appear"
echo "3. Open http://localhost:3000/register"
echo "4. Fill and submit the form to test real toasts"
echo "5. Check browser console for any JavaScript errors"

# Cleanup
rm -f /tmp/form_response

echo ""
echo "Test completed at $(date)"
