# Zwitch Payment Gateway Integration - From Scratch

## Goal

Build a clean, working Zwitch payment gateway integration that:
- ✅ Reads credentials from Supabase Vault (secrets)
- ✅ Automatically detects sandbox vs live mode
- ✅ Works for both test and production
- ✅ Simple and maintainable

## Architecture

### Flow:
1. **User clicks "Pay now"** → Frontend calls Edge Function
2. **Edge Function** → Reads credentials from Vault → Creates payment token with Zwitch
3. **Zwitch API** → Returns payment token
4. **Edge Function** → Returns token to frontend
5. **Frontend** → Opens Layer.js checkout with token
6. **User completes payment** → Layer.js callback
7. **Frontend** → Calls verify-payment Edge Function
8. **Edge Function** → Verifies payment with Zwitch → Updates order

## Implementation Plan

### Phase 1: Clean Edge Function for Payment Token Creation

**File:** `supabase/functions/create-payment-order/index.ts`

**What it should do:**
1. Read credentials from Supabase Vault (`ZWITCH_ACCESS_KEY`, `ZWITCH_SECRET_KEY`)
2. Detect sandbox vs live from access key prefix (`ak_test_` vs `ak_live_`)
3. Use correct endpoint based on environment
4. Create payment token with Zwitch API
5. Return token to frontend

**Key Points:**
- Simple, focused function
- Only handles Zwitch (for now)
- Clear error messages
- Proper logging

### Phase 2: Clean Edge Function for Payment Verification

**File:** `supabase/functions/verify-payment/index.ts`

**What it should do:**
1. Read credentials from Supabase Vault
2. Detect sandbox vs live
3. Verify payment status with Zwitch API
4. Update order in database
5. Return verification result

### Phase 3: Frontend Integration

**File:** `src/pages/Checkout.tsx`

**What it should do:**
1. Call `create-payment-order` Edge Function
2. Receive payment token
3. Load Layer.js SDK (sandbox or live based on token)
4. Open Layer.js checkout
5. Handle payment completion
6. Call `verify-payment` Edge Function

## Zwitch API Requirements

### Endpoints:
- **Sandbox:** `https://api.zwitch.io/v1/pg/sandbox/payment_token`
- **Live:** `https://api.zwitch.io/v1/pg/payment_token`

### Authorization:
- Format: `Bearer ${accessKey}:${secretKey}`
- Example: `Bearer ak_test_xxxxx:sk_test_xxxxx`

### Request Body:
```json
{
  "amount": 10,
  "currency": "INR",
  "contact_number": "7356697492",
  "email_id": "test@example.com",
  "mtx": "unique_transaction_id",
  "sub_accounts_id": "sa_xxxxx" // Optional
}
```

### Response:
```json
{
  "id": "payment_token_id"
}
```

## Step-by-Step Implementation

Let's build this cleanly, step by step.

