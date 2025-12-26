#!/bin/bash

# Test Zwitch Credentials and Account Status
# Replace these with your actual credentials from Zwitch Dashboard

ACCESS_KEY="ak_test_jgAZSHMgJq91eAEvmLOi2k8ivfDSaltHtX76"
SECRET_KEY="sk_test_Ckuyi0MKFeeDsF6tpjqbmne5zUzqwRB3H2d8"

# Determine environment
if [[ $ACCESS_KEY == ak_test_* ]] || [[ $ACCESS_KEY =~ ^ak_test_ ]]; then
  ENDPOINT="https://api.zwitch.io/v1/pg/sandbox/payment_token"
  ENV="Sandbox"
else
  ENDPOINT="https://api.zwitch.io/v1/pg/payment_token"
  ENV="Live"
fi

echo "=== Testing Zwitch Account Status ==="
echo "Environment: $ENV"
echo "Endpoint: $ENDPOINT"
echo "Access Key: ${ACCESS_KEY:0:20}..."
echo ""

# Test 1: Create payment token
echo "Test 1: Creating payment token..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  --request POST \
  --url "$ENDPOINT" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $ACCESS_KEY:$SECRET_KEY" \
  --data '{
    "amount": 1,
    "currency": "INR",
    "contact_number": "9999999999",
    "email_id": "test@example.com",
    "mtx": "test_'$(date +%s)'"
  }')

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
echo "Response: $BODY"
echo ""

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ SUCCESS! Your Zwitch account is active and credentials are correct!"
  echo "Payment token created successfully."
  exit 0
else
  ERROR_MSG=$(echo "$BODY" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "❌ ERROR: $ERROR_MSG"
  
  if [[ "$BODY" == *"User not found"* ]] || [[ "$ERROR_MSG" == *"User not found"* ]]; then
    echo ""
    echo "⚠️  ISSUE: Zwitch cannot find your merchant account."
    echo ""
    echo "Possible causes:"
    echo "1. Account not fully activated in Zwitch Dashboard"
    echo "2. Account verification/KYC not complete"
    echo "3. Sandbox not enabled (if using test credentials)"
    echo "4. Account suspended or inactive"
    echo ""
    echo "Next steps:"
    echo "1. Log in to Zwitch Dashboard"
    echo "2. Check account status - should be 'Active'"
    echo "3. Check if sandbox is enabled (for test credentials)"
    echo "4. Complete any pending verification/KYC"
    echo "5. Contact Zwitch support if account looks fine"
  fi
  exit 1
fi

