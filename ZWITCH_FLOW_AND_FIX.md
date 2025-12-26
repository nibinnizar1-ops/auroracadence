# Zwitch Payment Flow - Complete Explanation & Fix

## How Zwitch Payment Works

### Step 1: Server-Side Payment Token Creation (Edge Function)

**What happens:**
1. User clicks "Pay now" on checkout
2. Frontend calls Edge Function: `create-payment-order`
3. Edge Function calls Zwitch API:
   ```
   POST https://api.zwitch.io/v1/pg/sandbox/payment_token
   (or /pg/live/payment_token for production)
   ```
4. **Authorization Header:**
   ```
   Authorization: Bearer ${accessKey}:${secretKey}
   ```
5. **Request Body:**
   ```json
   {
     "amount": 10,
     "contact_number": "7356697492",
     "email_id": "john.doe@bankopen.co",
     "currency": "INR",
     "mtx": "test1234"
   }
   ```
6. **Zwitch API Response:**
   ```json
   {
     "id": "payment_token_id_here"  // This is the payment_token
   }
   ```

**Keys Used:**
- **Access Key** (`ak_live_...` or `ak_test_...`) - Used in Authorization header
- **Secret Key** (`sk_live_...` or `sk_test_...`) - Used in Authorization header
- **Both together:** `Bearer ${accessKey}:${secretKey}`

**Edge Function Returns to Frontend:**
```json
{
  "paymentToken": "payment_token_id_here",  // From Zwitch API response.id
  "accessKey": "ak_live_...",               // The ACCESS KEY (public, safe for client)
  "dbOrderId": "...",
  ...
}
```

### Step 2: Client-Side Layer.js Integration (Frontend)

**What happens:**
1. Frontend receives `paymentToken` and `accessKey` from Edge Function
2. Frontend loads Layer.js SDK:
   - **Sandbox:** `https://sandbox-payments.open.money/layer`
   - **Production:** `https://payments.open.money/layer`
3. Frontend calls `Layer.checkout()`:
   ```javascript
   Layer.checkout({
     token: orderData.paymentToken,    // From Edge Function (payment_token ID)
     accesskey: orderData.accessKey,   // From Edge Function (public access key)
     theme: {
       color: "#3d9080",
       error_color: "#ff2b2b"
     }
   }, function(response) {
     // Handle payment response
   })
   ```

**Keys Used:**
- **Access Key** - Public key, safe to use on client-side
- **Payment Token** - The token ID from Step 1
- **Secret Key** - NEVER sent to client (only used server-side)

### Step 3: Payment Completion

**What happens:**
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

## Current Implementation

### ✅ What's Working:
1. Edge Function creates payment token
2. Returns `paymentToken` and `accessKey` to frontend
3. Frontend uses them in `Layer.checkout()`
4. Authorization format is correct: `Bearer ${accessKey}:${secretKey}`

### ❌ What's Wrong:
**The endpoint URL is incorrect!**

**Error from Zwitch:**
```
"The route api/live/payment_token could not be found."
```

**What's happening:**
- Code is constructing: `https://api.zwitch.io/v1/pg/live/payment_token`
- But Zwitch is receiving: `api/live/payment_token` (missing `/pg/`)

**Possible causes:**
1. URL construction issue
2. Base URL in config is wrong
3. URL parsing issue

## The Fix

Based on your curl example, the endpoint should be:
- **Sandbox:** `https://api.zwitch.io/v1/pg/sandbox/payment_token`
- **Live:** `https://api.zwitch.io/v1/pg/live/payment_token`

The code currently constructs:
```typescript
const endpointUrl = `${apiBaseUrl}pg/${environment}/payment_token`;
// Should be: https://api.zwitch.io/v1/pg/live/payment_token
```

But the error suggests it's becoming `api/live/payment_token` - missing `/pg/` and the base URL.

**I've already fixed this by:**
1. Hardcoding base URL: `https://api.zwitch.io/v1/`
2. Ensuring `/pg/` is always included
3. Adding detailed logging

**Next step:** Redeploy the Edge Function and test again!

