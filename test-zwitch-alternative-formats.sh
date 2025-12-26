#!/bin/bash

# Test Zwitch API with different authentication formats
# This tests if there's a different way Zwitch expects authentication

ACCESS_KEY="ak_test_jgAZSHMgJq91eAEvmLOi2k8ivfDSaltHtX76"
SECRET_KEY="sk_test_Ckuyi0MKFeeDsF6tpjqbmne5zUzqwRB3H2d8"
ENDPOINT="https://api.zwitch.io/v1/pg/sandbox/payment_token"

echo "=== Testing Different Authentication Formats ===\n"

# Test 1: Standard Bearer format (current)
echo "Test 1: Bearer format (current)"
RESPONSE1=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
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
    "mtx": "test1"
  }')
HTTP1=$(echo "$RESPONSE1" | grep "HTTP_STATUS" | cut -d: -f2)
BODY1=$(echo "$RESPONSE1" | sed '/HTTP_STATUS/d')
echo "Status: $HTTP1"
echo "Response: $BODY1"
echo ""

# Test 2: Basic Auth format
echo "Test 2: Basic Auth format"
BASIC_AUTH=$(echo -n "$ACCESS_KEY:$SECRET_KEY" | base64)
RESPONSE2=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  --request POST \
  --url "$ENDPOINT" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "Authorization: Basic $BASIC_AUTH" \
  --data '{
    "amount": 1,
    "currency": "INR",
    "contact_number": "9999999999",
    "email_id": "test@example.com",
    "mtx": "test2"
  }')
HTTP2=$(echo "$RESPONSE2" | grep "HTTP_STATUS" | cut -d: -f2)
BODY2=$(echo "$RESPONSE2" | sed '/HTTP_STATUS/d')
echo "Status: $HTTP2"
echo "Response: $BODY2"
echo ""

# Test 3: Without Bearer prefix
echo "Test 3: Without Bearer prefix (just key:secret)"
RESPONSE3=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  --request POST \
  --url "$ENDPOINT" \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "Authorization: $ACCESS_KEY:$SECRET_KEY" \
  --data '{
    "amount": 1,
    "currency": "INR",
    "contact_number": "9999999999",
    "email_id": "test@example.com",
    "mtx": "test3"
  }')
HTTP3=$(echo "$RESPONSE3" | grep "HTTP_STATUS" | cut -d: -f2)
BODY3=$(echo "$RESPONSE3" | sed '/HTTP_STATUS/d')
echo "Status: $HTTP3"
echo "Response: $BODY3"
echo ""

# Test 4: Check if there's a merchant info endpoint
echo "Test 4: Trying to get merchant info (if endpoint exists)"
MERCHANT_ENDPOINT="https://api.zwitch.io/v1/pg/sandbox/merchant"
RESPONSE4=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  --request GET \
  --url "$MERCHANT_ENDPOINT" \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer $ACCESS_KEY:$SECRET_KEY")
HTTP4=$(echo "$RESPONSE4" | grep "HTTP_STATUS" | cut -d: -f2)
BODY4=$(echo "$RESPONSE4" | sed '/HTTP_STATUS/d')
echo "Status: $HTTP4"
echo "Response: $BODY4"
echo ""

echo "=== Summary ==="
if [ "$HTTP1" = "200" ] || [ "$HTTP1" = "201" ]; then
  echo "✅ Test 1 (Bearer) succeeded!"
elif [ "$HTTP2" = "200" ] || [ "$HTTP2" = "201" ]; then
  echo "✅ Test 2 (Basic Auth) succeeded!"
elif [ "$HTTP3" = "200" ] || [ "$HTTP3" = "201" ]; then
  echo "✅ Test 3 (No Bearer) succeeded!"
else
  echo "❌ All authentication formats failed"
  echo "This confirms it's an account-level issue, not authentication format"
fi

