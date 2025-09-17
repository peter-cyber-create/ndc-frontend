#!/bin/bash

# Pre-Conference Meetings Functionality Test Script
# Date: 2025-01-27

echo "🚀 Starting Pre-Conference Meetings Functionality Test"
echo "======================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test HTTP endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local test_name=$4
    local data=$5
    
    echo -e "${BLUE}Testing: $test_name${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.txt "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -o /tmp/response.txt -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS: $test_name (Status: $response)${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL: $test_name (Expected: $expected_status, Got: $response)${NC}"
        echo "Response body:"
        cat /tmp/response.txt
        echo ""
        ((TESTS_FAILED++))
    fi
    echo ""
}

# Function to test database
test_database() {
    local test_name=$1
    local query=$2
    local expected_result=$3
    
    echo -e "${BLUE}Testing Database: $test_name${NC}"
    
    result=$(sudo mysql -u root -e "USE conf; $query" 2>/dev/null | tail -n +2)
    
    if [[ "$result" == *"$expected_result"* ]]; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        echo "Expected: $expected_result"
        echo "Got: $result"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo "1. Testing Database Setup"
echo "========================"

test_database "Table exists" "SHOW TABLES LIKE 'pre_conference_meetings';" "pre_conference_meetings"
test_database "Sample data exists" "SELECT COUNT(*) FROM pre_conference_meetings;" "2"
test_database "Indexes created" "SHOW INDEX FROM pre_conference_meetings WHERE Key_name != 'PRIMARY';" "idx_pre_conference"

echo "2. Testing Frontend Pages"
echo "========================"

test_endpoint "GET" "/pre-conference" "200" "Pre-conference page loads"
test_endpoint "GET" "/admin/pre-conference" "200" "Admin pre-conference page loads"

echo "3. Testing API Endpoints"
echo "======================="

# Test GET endpoint for retrieving meetings
test_endpoint "GET" "/api/pre-conference" "200" "GET meetings API"
test_endpoint "GET" "/api/pre-conference?status=pending" "200" "GET meetings with status filter"
test_endpoint "GET" "/api/pre-conference?page=1&limit=5" "200" "GET meetings with pagination"

# Test POST endpoint with valid data
valid_submission='{
  "sessionTitle": "Test Workshop on Digital Health",
  "sessionDescription": "A comprehensive workshop on implementing digital health solutions in rural healthcare settings.",
  "meetingType": "workshop",
  "organizerName": "Dr. Test User",
  "organizerEmail": "test@example.com",
  "organizerPhone": "0800-100-066",
  "organization": "Test Health Organization",
  "coOrganizers": "",
  "meetingDate": "november_3",
  "meetingTimeStart": "09:00",
  "meetingTimeEnd": "12:00",
  "expectedAttendees": "75",
  "roomSize": "medium",
  "locationPreference": "physical",
  "abstractText": "This workshop will cover the latest developments in digital health technology and their application in resource-limited settings. Participants will learn about telemedicine implementation, electronic health records, and mobile health solutions.",
  "keywords": "digital health, telemedicine, electronic health records, mobile health, rural healthcare",
  "specialRequirements": "Projector and internet connection required",
  "paymentAmount": 300
}'

test_endpoint "POST" "/api/pre-conference" "201" "POST valid meeting submission" "$valid_submission"

# Test POST endpoint with invalid data (missing required fields)
invalid_submission='{
  "sessionTitle": "Incomplete Test",
  "meetingType": "workshop"
}'

test_endpoint "POST" "/api/pre-conference" "400" "POST invalid submission (missing fields)" "$invalid_submission"

# Test POST endpoint with invalid email
invalid_email_submission='{
  "sessionTitle": "Test with Invalid Email",
  "sessionDescription": "Test description",
  "meetingType": "meeting",
  "organizerName": "Test User",
  "organizerEmail": "invalid-email",
  "organizerPhone": "0800-100-066",
  "organization": "Test Org",
  "meetingDate": "november_3",
  "meetingTimeStart": "10:00",
  "meetingTimeEnd": "11:00",
  "expectedAttendees": "25",
  "roomSize": "small",
  "locationPreference": "physical",
  "abstractText": "Test abstract",
  "keywords": "test",
  "paymentAmount": 200
}'

test_endpoint "POST" "/api/pre-conference" "400" "POST invalid email format" "$invalid_email_submission"

echo "4. Testing Database After API Calls"
echo "==================================="

# Check if new submission was added
test_database "New submission in database" "SELECT COUNT(*) FROM pre_conference_meetings WHERE organizer_email = 'test@example.com';" "1"
test_database "Payment amount calculated" "SELECT payment_amount FROM pre_conference_meetings WHERE organizer_email = 'test@example.com';" "300"
test_database "Default status set" "SELECT approval_status FROM pre_conference_meetings WHERE organizer_email = 'test@example.com';" "pending"

echo "5. Testing Admin API Endpoints"
echo "============================="

# Get the ID of the test submission for admin tests
test_id=$(sudo mysql -u root -e "USE conf; SELECT id FROM pre_conference_meetings WHERE organizer_email = 'test@example.com';" 2>/dev/null | tail -n 1)

if [ ! -z "$test_id" ] && [ "$test_id" != "id" ]; then
    # Test admin approval
    approval_update='{
      "approval_status": "approved",
      "admin_notes": "Great session proposal, approved for November 3rd"
    }'
    
    test_endpoint "PATCH" "/api/admin/pre-conference/$test_id" "200" "PATCH approve meeting" "$approval_update"
    
    # Test admin payment update
    payment_update='{
      "payment_status": "paid",
      "payment_received_at": "2025-01-27T10:00:00.000Z"
    }'
    
    test_endpoint "PATCH" "/api/admin/pre-conference/$test_id" "200" "PATCH payment status" "$payment_update"
    
    # Verify updates in database
    test_database "Meeting approved" "SELECT approval_status FROM pre_conference_meetings WHERE id = $test_id;" "approved"
    test_database "Payment marked as paid" "SELECT payment_status FROM pre_conference_meetings WHERE id = $test_id;" "paid"
    test_database "Admin notes saved" "SELECT admin_notes FROM pre_conference_meetings WHERE id = $test_id;" "Great session proposal"
else
    echo -e "${YELLOW}⚠️  Warning: Could not find test submission ID for admin tests${NC}"
    ((TESTS_FAILED+=3))
fi

echo "6. Testing Form Validation & Edge Cases"
echo "======================================="

# Test duplicate submission prevention
test_endpoint "POST" "/api/pre-conference" "400" "POST duplicate email submission" "$valid_submission"

# Test invalid time format
invalid_time_submission='{
  "sessionTitle": "Test Invalid Time",
  "sessionDescription": "Test description",
  "meetingType": "meeting",
  "organizerName": "Test User",
  "organizerEmail": "test2@example.com",
  "organizerPhone": "0800-100-066",
  "organization": "Test Org",
  "meetingDate": "november_3",
  "meetingTimeStart": "25:00",
  "meetingTimeEnd": "26:00",
  "expectedAttendees": "25",
  "roomSize": "small",
  "locationPreference": "physical",
  "abstractText": "Test abstract",
  "keywords": "test",
  "paymentAmount": 200
}'

test_endpoint "POST" "/api/pre-conference" "400" "POST invalid time format" "$invalid_time_submission"

# Test end time before start time
wrong_time_submission='{
  "sessionTitle": "Test Wrong Time Order",
  "sessionDescription": "Test description",
  "meetingType": "meeting",
  "organizerName": "Test User",
  "organizerEmail": "test3@example.com",
  "organizerPhone": "0800-100-066",
  "organization": "Test Org",
  "meetingDate": "november_3",
  "meetingTimeStart": "14:00",
  "meetingTimeEnd": "12:00",
  "expectedAttendees": "25",
  "roomSize": "small",
  "locationPreference": "physical",
  "abstractText": "Test abstract",
  "keywords": "test",
  "paymentAmount": 200
}'

test_endpoint "POST" "/api/pre-conference" "400" "POST end time before start time" "$wrong_time_submission"

echo "7. Testing Navigation & UI Components"
echo "===================================="

# Test that navbar includes pre-conference link
if curl -s "$BASE_URL" | grep -q "Pre-Conference"; then
    echo -e "${GREEN}✅ PASS: Pre-Conference link in navbar${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Pre-Conference link not found in navbar${NC}"
    ((TESTS_FAILED++))
fi

# Test that admin panel includes pre-conference link
if curl -s "$BASE_URL/admin/pre-conference" | grep -q "Pre-Conference"; then
    echo -e "${GREEN}✅ PASS: Pre-Conference in admin navigation${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Pre-Conference not found in admin navigation${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "8. Cleanup Test Data"
echo "==================="

# Clean up test submissions
sudo mysql -u root -e "USE conf; DELETE FROM pre_conference_meetings WHERE organizer_email LIKE 'test%@example.com';" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Test data cleaned up successfully${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ Failed to clean up test data${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "📊 TEST RESULTS SUMMARY"
echo "======================"
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Pre-Conference Meetings functionality is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the failures above.${NC}"
    exit 1
fi
