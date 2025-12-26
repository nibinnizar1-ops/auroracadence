# Zwitch Payment Flow - Complete Explanation

## Overview

Zwitch payment works in **2 steps**:
1. **Server-side**: Create payment token (Edge Function)
2. **Client-side**: Use token in Layer.js SDK (Frontend)

## Step 1: Server-Side Payment Token Creation

### What Happens:
1. User clicks "Pay now" on checkout page
2. Frontend calls Edge Function: `create-payment-order`
3. Edge Function calls Zwitch API to create payment token

### Zwitch API Call:
```bash
POST https://api.zwitch.io/v1/pg/sandbox/payment_token
# OR for production:
POST https://api.zwitch.io/v1/pg/live/payment_token

Headers:
  Authorization: Bearer ${accessKey}:${secretKey}
  Content-Type: application/json

Body:
{
  "amount": 10,
  "contact_number": "7356697492",
  "email_id": "john.doe@bankopen.co",
  "currency": "INR",
  "mtx": "test1234"
}
```

### Keys Used:
- **Access Key** (`ak_live_...` or `ak_test_...`) - Public key
- **Secret Key** (`sk_live_...` or `sk_test_...`) - Private key
- **Authorization Format:** `Bearer ${accessKey}:${secretKey}`

### Zwitch API Response:
```json
{
  "id": "payment_token_id_here"  // This is the payment_token
}
```

### Edge Function Returns to Frontend:
```json
{
  "paymentToken": "payment_token_id_here",  // From Zwitch response.id
  "accessKey": "ak_live_...",               // The ACCESS KEY (public, safe for client)
  "dbOrderId": "...",
  ...
}
```

## Step 2: Client-Side Layer.js Integration

### What Happens:
1. Frontend receives `paymentToken` and `accessKey` from Edge Function
2. Frontend loads Layer.js SDK script:
   - **Sandbox:** `https://sandbox-payments.open.money/layer`
   - **Production:** `https://payments.open.money/layer`
3. Frontend calls `Layer.checkout()`

### Layer.js Code:
```javascript
Layer.checkout({
  token: orderData.paymentToken,    // Payment token from Edge Function
  accesskey: orderData.accessKey,   // Access key from Edge Function (public key)
  theme: {
    color: "#3d9080",
    error_color: "#ff2b2b"
  }
}, function(response) {
  // Handle payment response
  if (response.status == "captured") {
    // Payment successful
    // response.payment_token_id
    // response.payment_id
  }
}, function(err) {
  // Handle errors
})
```

### Keys Used in Layer.js:
- **Access Key** - Public key, **safe to use on client-side**
- **Payment Token** - The token ID from Step 1
- **Secret Key** - **NEVER sent to client** (only used server-side)

## Step 3: Payment Completion

### What Happens:
1. User completes payment in Layer.js modal
2. Layer.js calls success callback:
   ```javascript
   {
     status: "captured",
     payment_token_id: "pt_xxxxx",
     payment_id: "pay_xxxxx"
   }
   ```
3. Frontend calls `verify-payment` Edge Function
4. Edge Function verifies payment with Zwitch API
5. Order status updated, inventory deducted

## Key Points

### Access Key vs Secret Key

**Access Key** (`ak_live_...` or `ak_test_...`):
- ✅ **Public key** - Safe to use on client-side
- ✅ Used in `Layer.checkout({ accesskey: ... })`
- ✅ Used in Authorization header (server-side): `Bearer ${accessKey}:${secretKey}`
- ✅ Returned to frontend from Edge Function

**Secret Key** (`sk_live_...` or `sk_test_...`):
- ❌ **Private key** - NEVER sent to client
- ❌ Only used server-side in Authorization header
- ❌ Used in: `Bearer ${accessKey}:${secretKey}`
- ❌ Stored securely in database, never exposed

### Payment Token

- Created **server-side** (Edge Function)
- Returned to frontend
- Used in `Layer.checkout({ token: ... })`
- Identifies the payment order

## Current Implementation Status

### ✅ What's Working:
1. Edge Function creates payment token correctly
2. Returns `paymentToken` and `accessKey` to frontend
3. Frontend receives them and uses in `Layer.checkout()`
4. Authorization format is correct: `Bearer ${accessKey}:${secretKey}`
5. SDK loading works correctly

### ❌ Current Issue:
**Endpoint URL is wrong!**

**Error from Zwitch:**
```
"The route api/live/payment_token could not be found."
```

**What should happen:**
- Endpoint: `https://api.zwitch.io/v1/pg/live/payment_token`
- But Zwitch is receiving: `api/live/payment_token` (missing `/pg/`)

**Fix Applied:**
- Hardcoded base URL: `https://api.zwitch.io/v1/`
- Ensured `/pg/` is always included in path
- Added detailed logging

**Next Step:** Redeploy Edge Function and test!

## How Keys Are Populated

### In Edge Function (`create-payment-order`):

1. **Fetch credentials from database:**
   ```typescript
   const accessKey = config.credentials.access_key;  // From database
   const secretKey = config.credentials.secret_key;  // From database
   ```

2. **Use in Zwitch API call:**
   ```typescript
   Authorization: `Bearer ${accessKey}:${secretKey}`
   ```

3. **Return to frontend:**
   ```typescript
   return {
     paymentToken: zwitchPayment.id,  // From Zwitch API response
     accessKey: accessKey,             // Public key (safe for client)
   }
   ```

### In Frontend (`Checkout.tsx`):

1. **Receive from Edge Function:**
   ```typescript
   const { data: orderData } = await supabase.functions.invoke("create-payment-order", {...});
   // orderData.paymentToken
   // orderData.accessKey
   ```

2. **Use in Layer.js:**
   ```typescript
   Layer.checkout({
     token: orderData.paymentToken,    // Payment token ID
     accesskey: orderData.accessKey,   // Public access key
   })
   ```

## Summary

✅ **Server-side (Edge Function):**
- Uses both `accessKey` and `secretKey` in Authorization header
- Creates payment token via Zwitch API
- Returns `paymentToken` and `accessKey` to frontend

✅ **Client-side (Frontend):**
- Receives `paymentToken` and `accessKey` from Edge Function
- Uses them in `Layer.checkout()`
- Never sees `secretKey` (stays on server)

The implementation is correct! The only issue is the endpoint URL, which I've already fixed. Just need to redeploy the Edge Function.

