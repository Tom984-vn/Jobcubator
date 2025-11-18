#!/usr/bin/env bash
# Simple test script for /api/auth/register and /api/user/me
# Usage: ./test-register-and-me.sh

echo "test"

# set -e

BASE_URL="http://localhost:8080"
REGISTER_ENDPOINT="$BASE_URL/api/auth/register"
ME_ENDPOINT="$BASE_URL/api/user/me"

# registration payload - adapt fields to your DTO if different
read -r -d '' PAYLOAD <<'JSON'
{
  "username": "testuser1",
  "email": "testuser1@example.com",
  "password": "P@ssw0rd123",
  "fullName": "TestUser"
}
JSON

echo "Registering user..."
RESP=$(curl -s -w "\n%{http_code}" -X POST "$REGISTER_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# split body and status
HTTP_BODY=$(echo "$RESP" | sed '$d')
HTTP_STATUS=$(echo "$RESP" | tail -n1)

echo "Status: $HTTP_STATUS"
echo "Response body:"
echo "$HTTP_BODY" | jq .

if [ "$HTTP_STATUS" -ge 300 ]; then
  echo "Registration failed, aborting."
  exit 1
fi

# try to extract token from common fields
TOKEN=$(echo "$HTTP_BODY" | jq -r '.accessToken // .token // .access_token // empty')

if [ -z "$TOKEN" ]; then
  echo "No token found in register response. Check response fields."
  exit 1
fi

echo "Got token, calling /api/user/me..."
curl -s -X GET "$ME_ENDPOINT" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .
