# Where Payment Gateway Keys Are Stored (Server-Side)

## Storage Location

### Database Table: `payment_gateways`

The keys are stored in the **Supabase PostgreSQL database** in the `payment_gateways` table.

**Table Structure:**
```sql
CREATE TABLE public.payment_gateways (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_test_mode BOOLEAN NOT NULL DEFAULT true,
  credentials JSONB NOT NULL DEFAULT '{}',  -- ⭐ KEYS STORED HERE
  webhook_secret TEXT,
  supported_currencies TEXT[],
  supported_methods TEXT[],
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Credentials Column (JSONB)

The `credentials` column stores the keys as JSON:

**For Zwitch:**
```json
{
  "access_key": "ak_live_xxxxxxxxxxxxx",
  "secret_key": "sk_live_xxxxxxxxxxxxx"
}
```

**For Razorpay:**
```json
{
  "key_id": "rzp_live_xxxxxxxxxxxxx",
  "key_secret": "xxxxxxxxxxxxx"
}
```

**For PayU:**
```json
{
  "merchant_key": "xxxxxxxxxxxxx",
  "merchant_salt": "xxxxxxxxxxxxx",
  "merchant_id": "xxxxxxxxxxxxx"
}
```

**For Cashfree:**
```json
{
  "app_id": "xxxxxxxxxxxxx",
  "secret_key": "xxxxxxxxxxxxx"
}
```

## How Keys Are Stored

### 1. Admin Panel Configuration

**Location:** `/admin/payments/gateways`

**Process:**
1. Admin goes to Payment Gateways page
2. Clicks "Configure" on a gateway (e.g., Zwitch)
3. Enters credentials in the form:
   - Access Key: `ak_live_...`
   - Secret Key: `sk_live_...`
4. Clicks "Save Configuration"

**Code:** `src/pages/admin/PaymentGatewayForm.tsx`
```typescript
const { data, error } = await updatePaymentGateway(gateway.id, {
  credentials: {
    access_key: "ak_live_...",
    secret_key: "sk_live_..."
  },
  is_test_mode: isTestMode,
});
```

### 2. Database Storage

**API Function:** `src/lib/admin-payment-gateways.ts`
```typescript
export async function updatePaymentGateway(
  id: string,
  updates: Partial<PaymentGateway>
) {
  const { data, error } = await supabase
    .from("payment_gateways")
    .update({
      credentials: updates.credentials,  // Stored as JSONB
      is_test_mode: updates.is_test_mode,
    })
    .eq("id", id);
}
```

**Database:**
- Stored in PostgreSQL `payment_gateways` table
- Column: `credentials` (JSONB type)
- Format: JSON object with key-value pairs

## How Keys Are Retrieved (Server-Side)

### Edge Function: `create-payment-order`

**Location:** `supabase/functions/create-payment-order/index.ts`

**Process:**
1. Edge Function queries database for active gateway:
   ```typescript
   const { data: gateway } = await supabase
     .from("payment_gateways")
     .select("*")
     .eq("is_active", true)
     .single();
   ```

2. Extracts credentials:
   ```typescript
   const accessKey = gateway.credentials.access_key;
   const secretKey = gateway.credentials.secret_key;
   ```

3. Uses in Zwitch API call:
   ```typescript
   Authorization: `Bearer ${accessKey}:${secretKey}`
   ```

**Full Code:**
```typescript
// Get active gateway from database
const { data: gateway } = await supabase
  .from("payment_gateways")
  .select("*")
  .eq("is_active", true)
  .single();

// Extract credentials
const config: PaymentGatewayConfig = {
  credentials: gateway.credentials as Record<string, string>,
  isTestMode: gateway.is_test_mode,
  webhookSecret: gateway.webhook_secret || undefined,
  config: gateway.config as Record<string, any> || {},
};

// Use in Zwitch API
const accessKey = config.credentials.access_key;
const secretKey = config.credentials.secret_key;
```

## Security

### Current Implementation

**⚠️ Important:** The credentials are currently stored as **plain JSON** in the database.

**RLS (Row Level Security) Policies:**
- ✅ Only admins can view/edit credentials
- ✅ Public can only see active gateway (without credentials)
- ✅ Credentials are protected by RLS policies

**RLS Policy:**
```sql
-- Admins can manage payment gateways
CREATE POLICY "Admins can manage payment gateways"
ON public.payment_gateways
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);
```

### Recommended: Encryption

**Note:** The migration comment says "Encrypted" but currently they're stored as plain JSON.

**To add encryption (future enhancement):**
1. Use Supabase Vault for encryption
2. Or encrypt before storing in database
3. Decrypt when reading in Edge Function

## Access Flow

### 1. Admin Configures Keys
```
Admin Panel → Payment Gateways → Configure → Enter Keys → Save
↓
Database: payment_gateways.credentials (JSONB)
```

### 2. Edge Function Uses Keys
```
User clicks "Pay now"
↓
Edge Function: create-payment-order
↓
Query: SELECT * FROM payment_gateways WHERE is_active = true
↓
Extract: gateway.credentials.access_key, gateway.credentials.secret_key
↓
Use in: Authorization: Bearer ${accessKey}:${secretKey}
↓
Call Zwitch API
```

### 3. Frontend Never Sees Secret Key
```
Edge Function returns to frontend:
{
  paymentToken: "...",
  accessKey: "ak_live_...",  // ✅ Public key (safe)
  // secretKey: NOT INCLUDED ❌
}
```

## Viewing Keys in Database

### SQL Query:
```sql
SELECT 
  id,
  name,
  code,
  is_active,
  is_test_mode,
  credentials->>'access_key' as access_key,
  credentials->>'secret_key' as secret_key,
  updated_at
FROM payment_gateways
WHERE code = 'zwitch';
```

### Admin Panel:
- Go to: `/admin/payments/gateways`
- Click "Configure" on a gateway
- See credentials in the form (masked for security)

## Summary

**Storage:**
- ✅ Database: `payment_gateways` table
- ✅ Column: `credentials` (JSONB)
- ✅ Format: JSON object

**Access:**
- ✅ Admin panel: Configure through UI
- ✅ Edge Function: Reads from database
- ✅ Frontend: Never sees secret key

**Security:**
- ✅ RLS policies protect credentials
- ✅ Only admins can access
- ⚠️ Currently stored as plain JSON (encryption recommended)

