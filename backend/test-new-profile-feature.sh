#!/usr/bin/env bash

# Configuration
BASE_URL="http://localhost:8080"
REGISTER_ENDPOINT="$BASE_URL/api/auth/register"
ME_ENDPOINT="$BASE_URL/api/user/me"

# Generate random user to avoid conflicts
USERNAME="userdeptraikhongngan1ai"
EMAIL="userdeptrai0ngan1ai@example.com"

echo "--------------------------------------------------"
echo "1. Registering new user: $USERNAME"
echo "--------------------------------------------------"

# Registration Payload
read -r -d '' REGISTER_PAYLOAD <<JSON
{
  "username": "$USERNAME",
  "email": "$EMAIL",
  "password": "P@ssw0rd123",
  "fullName": "Test User"
}
JSON

# Execute Register
RESP=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$REGISTER_PAYLOAD")

HTTP_BODY=$(echo "$RESP" | sed '$d')
HTTP_STATUS=$(echo "$RESP" | tail -n1)

if [ "$HTTP_STATUS" -ge 300 ]; then
  echo "Registration failed with status $HTTP_STATUS"
  echo "$HTTP_BODY"
  exit 1
fi

# Extract Token
TOKEN=$(echo "$HTTP_BODY" | jq -r '.accessToken // .token // .access_token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Error: No token found in response."
  exit 1
fi

echo "Success! Token acquired."

echo "--------------------------------------------------"
echo "2. Updating Profile with Education & Experience"
echo "--------------------------------------------------"

# Update Payload with History
read -r -d '' UPDATE_PAYLOAD <<JSON
{
  "fullName": "Updated Name",
  "gender" : "MALE",
  "phoneNumber": "1234567890",
  "birthDate": "1995-05-20",
  "yearsOfExperience": 3,
  "organization": "Tech Corp",
  "position": "Senior Developer",
  "preferredLocation": "New York",
  "minSalary": 60000,
  "maxSalary": 90000,
  "history": [
    {
      "type": "EDUCATION",
      "organization": "MIT",
      "title": "Computer Science",
      "startDate": "2013-09-01",
      "endDate": "2017-06-01",
      "description": "Graduated with honors"
    },
    {
      "type": "EXPERIENCE",
      "organization": "Google",
      "title": "Software Engineer",
      "startDate": "2017-07-01",
      "endDate": "2020-01-01",
      "description": "Worked on Search API"
    }
  ]
}
JSON

# Execute Update
UPDATE_RESP=$(curl -s -w "\n%{http_code}" -X PUT "$ME_ENDPOINT" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$UPDATE_PAYLOAD")

UPDATE_BODY=$(echo "$UPDATE_RESP" | sed '$d')
UPDATE_STATUS=$(echo "$UPDATE_RESP" | tail -n1)

echo "Update Status: $UPDATE_STATUS"
echo "$UPDATE_BODY" | jq .

echo "--------------------------------------------------"
echo "3. Verifying Data (GET /me)"
echo "--------------------------------------------------"

# Verify
curl -s -X GET "$ME_ENDPOINT" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .
