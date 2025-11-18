#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
USERNAME="${USERNAME:-testuser1}"
PASSWORD="${PASSWORD:-P@ssw0rd123}"

# create small pseudo files
AVATAR_FILE="/tmp/avatar.png"
CV_FILE="/tmp/cv.pdf"

# write PNG magic bytes
printf '%b' '\x89PNG\r\n\x1a\n' > "$AVATAR_FILE"
# write PDF header, escape percent with %% or use %s format
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

echo "Uploading avatar..."
AVATAR_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/upload/avatar/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@${AVATAR_FILE};type=image/png")

AVATAR_BODY=$(echo "$AVATAR_RESP" | sed '$d')
AVATAR_STATUS=$(echo "$AVATAR_RESP" | tail -n1)
echo "Avatar upload status: $AVATAR_STATUS"
echo "$AVATAR_BODY" | jq .

echo "Uploading CV..."
CV_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/upload/cv/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@${CV_FILE};type=application/pdf")

CV_BODY=$(echo "$CV_RESP" | sed '$d')
CV_STATUS=$(echo "$CV_RESP" | tail -n1)
echo "CV upload status: $CV_STATUS"
echo "$CV_BODY" | jq .

# extract objectKey/avatarUrl/cvUrl if present
AVATAR_KEY=$(echo "$AVATAR_BODY" | jq -r '.objectKey // empty')
AVATAR_URL=$(echo "$AVATAR_BODY" | jq -r '.avatarUrl // empty')
CV_KEY=$(echo "$CV_BODY" | jq -r '.objectKey // empty')
CV_URL=$(echo "$CV_BODY" | jq -r '.cvUrl // empty')

echo "Results:"
echo " avatar.objectKey: ${AVATAR_KEY:-<none>}"
echo " avatar.avatarUrl: ${AVATAR_URL:-<none>}"
echo " cv.objectKey: ${CV_KEY:-<none>}"
echo " cv.cvUrl: ${CV_URL:-<none>}"

echo "Done."
