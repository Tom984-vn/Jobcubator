#!/usr/bin/env bash
# filepath: ./test-userprofile-and-upload.sh
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
USERNAME="${USERNAME:-testuser1}"
PASSWORD="${PASSWORD:-P@ssw0rd123}"

# create small pseudo files
AVATAR_FILE="/tmp/avatar.png"
CV_FILE="/tmp/cv.pdf"
printf '%b' '\x89PNG\r\n\x1a\n' > "$AVATAR_FILE"
printf '%s\n' '%%PDF-1.4' > "$CV_FILE"

echo "Logging in..."
LOGIN_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}")

HTTP_BODY=$(echo "$LOGIN_RESP" | sed '$d')
HTTP_STATUS=$(echo "$LOGIN_RESP" | tail -n1)

if [ "$HTTP_STATUS" -ge 300 ]; then
  echo "Login failed ($HTTP_STATUS):"
  echo "$HTTP_BODY" | jq .
  exit 1
fi

TOKEN=$(echo "$HTTP_BODY" | jq -r '.accessToken // .token // .access_token // empty')
if [ -z "$TOKEN" ]; then
  echo "No token found in login response:"
  echo "$HTTP_BODY" | jq .
  exit 1
fi
echo "Got token."

echo "Updating user profile..."
PROFILE_JSON=$(
  jq -n --arg bd "1990-01-01" \
        --arg org "Acme Inc" \
        --arg pos "Engineer" \
        --arg pref "Hanoi" \
        --arg phone "+1234567890" \
        --argjson years 3 \
        --argjson minS 500 \
        --argjson maxS 1500 \
        '{
          birthDate: $bd,
          years_of_experience: $years,
          organization: $org,
          position: $pos,
          preferredLocation: $pref,
          minSalary: $minS,
          maxSalary: $maxS
        }'
)

curl -s -o /dev/stderr -w "\n" -X PUT "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PROFILE_JSON"

echo "Fetching updated profile..."
curl -s -X GET "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .

echo "Uploading avatar..."
AVATAR_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/upload/avatar/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@${AVATAR_FILE};type=image/png")

AVATAR_BODY=$(echo "$AVATAR_RESP" | sed '$d')
AVATAR_STATUS=$(echo "$AVATAR_RESP" | tail -n1)
echo "Avatar upload status: $AVATAR_STATUS"
echo "$AVATAR_BODY" | jq .

# if storage returns an objectKey and your API exposes an endpoint to attach it to profile,
# call that endpoint (adjust path if different). Example POST/PUT endpoints below are optional:
AVATAR_KEY=$(echo "$AVATAR_BODY" | jq -r '.objectKey // empty')
if [ -n "$AVATAR_KEY" ]; then
  echo "Saving avatar key to profile..."
  curl -s -X PUT "$BASE_URL/api/user/me/avatar" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: text/plain" \
    --data "$AVATAR_KEY" -o /dev/stderr -w "\n"
fi

echo "Fetching profile after avatar..."
curl -s -X GET "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .

echo "Uploading CV..."
CV_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/upload/cv/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@${CV_FILE};type=application/pdf")

CV_BODY=$(echo "$CV_RESP" | sed '$d')
CV_STATUS=$(echo "$CV_RESP" | tail -n1)
echo "CV upload status: $CV_STATUS"
echo "$CV_BODY" | jq .

CV_KEY=$(echo "$CV_BODY" | jq -r '.objectKey // empty')
if [ -n "$CV_KEY" ]; then
  echo "Saving CV key to profile..."
  curl -s -X PUT "$BASE_URL/api/user/me/cv" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: text/plain" \
    --data "$CV_KEY" -o /dev/stderr -w "\n"
fi

echo "Final profile fetch..."
curl -s -X GET "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | jq .

echo "Done."
