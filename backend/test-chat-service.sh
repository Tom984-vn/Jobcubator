#!/usr/bin/env bash

# ==========================================
# CONFIGURATION
# ==========================================
BASE_URL="http://localhost:8080"
JQ_CMD="jq -r" # Requires 'jq' installed

# Random suffix to ensure uniqueness
RAND=$RANDOM
MANAGER_USER="manager_$RAND"
MANAGER_EMAIL="manager_$RAND@jobcubator.com"
CANDIDATE_USER="candidate_$RAND"
CANDIDATE_EMAIL="candidate_$RAND@jobcubator.com"

echo "=================================================="
echo "JOBCUBATOR END-TO-END TEST FLOW"
echo "=================================================="

# ==========================================
# 1. REGISTER MANAGER (User A)
# ==========================================
echo -e "\n[1] Registering Manager ($MANAGER_USER)..."
RESP_M=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$MANAGER_USER\",
    \"email\": \"$MANAGER_EMAIL\",
    \"password\": \"password123\",
    \"fullName\": \"Alice Manager\"
  }")

TOKEN_M=$(echo "$RESP_M" | $JQ_CMD '.accessToken // .token')
echo "Manager Token: ${TOKEN_M:0:10}..."

# ==========================================
# 2. REGISTER CANDIDATE (User B)
# ==========================================
echo -e "\n[2] Registering Candidate ($CANDIDATE_USER)..."
RESP_C=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$CANDIDATE_USER\",
    \"email\": \"$CANDIDATE_EMAIL\",
    \"password\": \"password123\",
    \"fullName\": \"Bob Candidate\"
  }")

TOKEN_C=$(echo "$RESP_C" | $JQ_CMD '.accessToken // .token')
echo "Candidate Token: ${TOKEN_C:0:10}..."

# ==========================================
# 3. MANAGER CREATES COMPANY
# ==========================================
echo -e "\n[3] Manager creating Company..."
RESP_COMP=$(curl -s -X POST "$BASE_URL/api/companies" \
  -H "Authorization: Bearer $TOKEN_M" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Tech Corp $RAND\",
    \"description\": \"The best place to work\",
    \"website\": \"https://techcorp$RAND.com\",
    \"location\": \"Silicon Valley\"
  }")

COMPANY_ID=$(echo "$RESP_COMP" | $JQ_CMD '.id')
echo "Company Created: $COMPANY_ID"

# ==========================================
# 4. MANAGER CREATES JOB POST
# ==========================================
echo -e "\n[4] Manager creating Job Post..."
RESP_JOB=$(curl -s -X POST "$BASE_URL/api/job-posts" \
  -H "Authorization: Bearer $TOKEN_M" \
  -H "Content-Type: application/json" \
  -d "{
    \"companyId\": \"$COMPANY_ID\",
    \"title\": \"Senior Java Developer\",
    \"description\": \"We need a rockstar dev.\",
    \"requirements\": \"Java, Spring Boot, Docker\",
    \"location\": \"Remote\",
    \"salaryRange\": \"100k-150k\",
    \"type\": \"FULL_TIME\"
  }")

JOB_ID=$(echo "$RESP_JOB" | $JQ_CMD '.id')
echo "Job Post Created: $JOB_ID"

# ==========================================
# 5. CANDIDATE UPDATES PROFILE
# ==========================================
echo -e "\n[5] Candidate updating Profile..."
curl -s -o /dev/null -X PUT "$BASE_URL/api/user/me" \
  -H "Authorization: Bearer $TOKEN_C" \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Bob Candidate\",
    \"yearsOfExperience\": 5,
    \"position\": \"Java Developer\",
    \"history\": [
      {
        \"type\": \"EXPERIENCE\",
        \"organization\": \"Old Corp\",
        \"title\": \"Junior Dev\",
        \"startDate\": \"2020-01-01\",
        \"endDate\": \"2022-01-01\"
      }
    ]
  }"
echo "Profile Updated."

# ==========================================
# 6. CANDIDATE APPLIES FOR JOB
# ==========================================
echo -e "\n[6] Candidate applying for Job ($JOB_ID)..."
RESP_APP=$(curl -s -X POST "$BASE_URL/api/applications" \
  -H "Authorization: Bearer $TOKEN_C" \
  -H "Content-Type: application/json" \
  -d "{
    \"jobPostId\": \"$JOB_ID\",
    \"coverLetter\": \"I am the perfect fit for this role.\"
  }")

APP_ID=$(echo "$RESP_APP" | $JQ_CMD '.id')
echo "Application Submitted. ID: $APP_ID"

# ==========================================
# 7. CHAT SIMULATION (VIA WEBSOCAT)
# ==========================================
echo -e "\n[7] Candidate sending message via WebSocket..."

# We use printf to generate the STOMP frames because we need the NULL byte (\0)
# Frame 1: CONNECT with JWT Authorization header
# Frame 2: SEND to the specific application destination
# Note: The URL ends in /websocket because you are using SockJS

# Construct the STOMP payload
# 1. CONNECT frame
# 2. SEND frame
# 3. Pipe into websocat
# 4. Use 'timeout' because websocat stays open by default

printf "CONNECT\naccept-version:1.1,1.0\nheart-beat:0,0\nAuthorization:Bearer %s\n\n\0SEND\ndestination:/app/chat/%s\n\nHello Manager, I am using raw WebSockets!\0" \
  "$TOKEN_C" "$APP_ID" \
  | timeout 1s websocat -n --binary "ws://localhost:8080/ws/websocket"

echo "Candidate message sent."

echo -e "\n[8] Manager replying via WebSocket..."

printf "CONNECT\naccept-version:1.1,1.0\nheart-beat:0,0\nAuthorization:Bearer %s\n\n\0SEND\ndestination:/app/chat/%s\n\nHi Candidate, I received your STOMP message!\0" \
  "$TOKEN_M" "$APP_ID" \
  | timeout 1s websocat -n --binary "ws://localhost:8080/ws/websocket"

echo "Manager reply sent."

# ==========================================
# 9. VERIFY CHAT HISTORY (VIA REST)
# ==========================================
echo -e "\n[9] Fetching Chat History to verify persistence..."
HISTORY=$(curl -s -X GET "$BASE_URL/api/applications/$APP_ID/chat" \
  -H "Authorization: Bearer $TOKEN_C")

echo "$HISTORY" | jq .

echo -e "\nDone."