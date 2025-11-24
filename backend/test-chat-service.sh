#!/usr/bin/env bash

# Configuration
BASE_URL="http://localhost:8080"
WS_URL="ws://localhost:8080/ws/websocket" # Standard Spring SockJS fallback path
USERNAME="aitester123"
PASSWORD="P@ssw0rd123"
EMAIL="ai_tester@example.com"

# Check dependencies
if ! command -v websocat &> /dev/null; then
    echo "Error: websocat is not installed. Please install it (e.g., cargo install websocat or download binary)."
    exit 1
fi

echo "--- Step 1: Authentication ---"

# 1. Try to Login
echo "Attempting Login..."
LOGIN_PAYLOAD=$(jq -n \
                  --arg u "$USERNAME" \
                  --arg p "$PASSWORD" \
                  '{username: $u, password: $p}')

LOGIN_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_PAYLOAD")

HTTP_BODY=$(echo "$LOGIN_RESP" | sed '$d')
HTTP_STATUS=$(echo "$LOGIN_RESP" | tail -n1)
TOKEN=""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo "Login successful."
    TOKEN=$(echo "$HTTP_BODY" | jq -r '.accessToken // .token // .access_token // empty')
else
    echo "Login failed (Status: $HTTP_STATUS). Attempting Registration..."
    
    # 2. Fallback to Register
    REGISTER_PAYLOAD=$(jq -n \
                      --arg u "$USERNAME" \
                      --arg p "$PASSWORD" \
                      --arg e "$EMAIL" \
                      '{username: $u, password: $p, email: $e, fullName: "AITester"}')

    REG_RESP=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
      -H "Content-Type: application/json" \
      -d "$REGISTER_PAYLOAD")
    
    REG_BODY=$(echo "$REG_RESP" | sed '$d')
    REG_STATUS=$(echo "$REG_RESP" | tail -n1)

    if [ "$REG_STATUS" -ge 300 ]; then
        echo "Registration failed. Response: $REG_BODY"
        exit 1
    fi
    
    echo "Registration successful."
    TOKEN=$(echo "$REG_BODY" | jq -r '.accessToken // .token // .access_token // empty')
fi

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
    echo "Error: Could not extract token."
    exit 1
fi

echo "Token obtained."

echo "--- Step 2: WebSocket AI Chat ---"

# Prepare STOMP Frames
# Note: STOMP requires a NULL byte (\0) at the end of every frame.

# 1. CONNECT Frame
# We must send the Authorization header here as per your WebSocketConfig.java
generate_connect_frame() {
    printf "CONNECT\n"
    printf "accept-version:1.1,1.0\n"
    printf "heart-beat:10000,10000\n"
    printf "Authorization:Bearer %s\n" "$TOKEN"
    printf "\n"
    printf "\0"
}

# 2. SUBSCRIBE Frame
# Subscribing to /user/queue/stream to receive the AI chunks
generate_subscribe_frame() {
    printf "SUBSCRIBE\n"
    printf "id:sub-0\n"
    printf "destination:/user/queue/stream\n"
    printf "\n"
    printf "\0"
}

# 3. SEND Frame
# Sending to /api/chat/send (Prefix /api + @MessageMapping /chat/send)
generate_send_frame() {
    local content="Hello AI, please tell me a very short joke."
    # JSON Payload for ChatRequest
    local payload="{\"content\":\"$content\",\"conversationId\":null}"
    
    printf "SEND\n"
    printf "destination:/api/chat/send\n"
    printf "content-type:application/json\n"
    printf "\n"
    printf "%s" "$payload"
    printf "\0"
}

# Execute websocat
# We use a subshell to pipe commands with delays to ensure the server processes the connection before we send data.
echo "Connecting to $WS_URL..."

(
    generate_connect_frame
    sleep 1
    generate_subscribe_frame
    sleep 1
    generate_send_frame
    # Keep the pipe open long enough to receive the response
    sleep 200
) | websocat -v "$WS_URL"

echo -e "\n--- Test Finished ---"
