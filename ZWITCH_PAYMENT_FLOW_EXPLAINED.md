# Zwitch Payment Flow - Complete Explanation

## How Zwitch Payment Works

### Step 1: Server-Side Payment Token Creation (Edge Function)

**What happens:**
1. User clicks "Pay now" on checkout page
2. Frontend calls Edge Function: `create-payment-order`
3. Edge Function calls Zwitch API to create payment token:
   ```
   POST https://api.zwitch.io/v1/pg/sandbox/payment_token
   (or /pg/live/payment_token for production)
   ```
4. Zwitch API returns: `payment_token` (an ID like "pt_xxxxx")

**Keys used:**
- **Access Key** (`ak_live_...` or `ak_test_...`) - Used in Authorization header
- **Secret Key** (`sk_live_...` or `sk_test_...`) - Used in Authorization header
- **Authorization format:** `Bearer ${accessKey}:${secretKey}`

**Edge Function returns to frontend:**
```json
{
  "paymentToken": "pt_xxxxx",  // The payment token ID from Zwitch
  "accessKey": "ak_live_...",  // The ACCESS KEY (public, safe for client)
  "dbOrderId": "...",
  ...
}
```

### Step 2: Client-Side Layer.js Integration (Frontend)

**What happens:**
1. Frontend receives `paymentToken` and `accessKey` from Edge Function
2. Frontend loads Layer.js SDK script:
   - Sandbox: `https://sandbox-payments.open.money/layer`
   - Production: `https://payments.open.money/layer`
3. Frontend calls `Layer.checkout()`:
   ```javascript
   Layer.checkout({
     token: paymentToken,      // From Edge Function response
     accesskey: accessKey,      // From Edge Function response (public key)
     theme: { ... }
   }, successCallback, errorCallback)
   ```

**Keys used:**
- **Access Key** - Public key, safe to use on client-side
- **Payment Token** - The token ID from Step 1
- **Secret Key** - NEVER sent to client (only used server-side)

### Step 3: Payment Completion

**What happens:**
1. User completes payment in Layer.js modal
2. Layer.js calls success callback with:
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

- **Access Key** (`ak_live_...`):
  - Public key
  - Safe to use on client-side
  - Used in `Layer.checkout({ accesskey: ... })`
  - Used in Authorization header (server-side)

- **Secret Key** (`sk_live_...`):
  - Private key
  - NEVER sent to client
  - Only used server-side in Authorization header
  - Used in: `Bearer ${accessKey}:${secretKey}`

### Payment Token

- Created server-side (Edge Function)
- Returned to frontend
- Used in `Layer.checkout({ token: ... })`
- Identifies the payment order

## Current Implementation Status

✅ **Edge Function** creates payment token correctly
✅ **Frontend** receives `paymentToken` and `accessKey`
✅ **Frontend** uses them in `Layer.checkout()`
✅ **Authorization** format is correct: `Bearer ${accessKey}:${secretKey}`

⚠️ **Issue:** Endpoint URL might be wrong (missing `/pg/` or wrong path)

## Next: Fix the Endpoint

Based on your curl example, the endpoint should be:
- Sandbox: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
- Live: `https://api.zwitch.io/v1/pg/live/payment_token`

But you also mentioned: `https://api.zwitch.io/v1/pg/payment_token` (without sandbox/live)

Let me check the Zwitch documentation to confirm the correct endpoint format.

