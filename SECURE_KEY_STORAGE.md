# Secure Key Storage in Supabase

## Current Implementation

### How Keys Are Currently Stored

**Location:** PostgreSQL Database
- **Table:** `payment_gateways`
- **Column:** `credentials` (JSONB type)
- **Format:** Plain JSON (not encrypted)

**Example:**
```json
{
  "access_key": "ak_live_xxxxxxxxxxxxx",
  "secret_key": "sk_live_xxxxxxxxxxxxx"
}
```

### How Edge Function Retrieves Keys

**Current Flow:**
1. Edge Function queries database:
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

3. Uses in API calls:
   ```typescript
   Authorization: `Bearer ${accessKey}:${secretKey}`
   ```

## Security Concerns

### Current Issues:
- ⚠️ Keys stored as **plain JSON** in database
- ⚠️ Visible to anyone with database access
- ⚠️ No encryption at rest
- ⚠️ Logged in Edge Function logs (if not careful)

### Protection Currently:
- ✅ RLS policies restrict access (only admins can view)
- ✅ Keys never sent to frontend
- ✅ Only used server-side in Edge Functions

## Secure Storage Options in Supabase

### Option 1: Supabase Vault (Recommended) ⭐

**Supabase Vault** is a built-in secure storage for secrets.

**How it works:**
- Encrypted at rest
- Only accessible via Edge Functions
- Never exposed to frontend
- Managed through Supabase Dashboard

**Implementation:**

1. **Store secrets in Vault:**
   ```bash
   # Via Supabase CLI
   supabase secrets set ZWITCH_ACCESS_KEY=ak_live_xxxxx
   supabase secrets set ZWITCH_SECRET_KEY=sk_live_xxxxx
   ```

2. **Access in Edge Function:**
   ```typescript
   const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
   const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
   ```

**Pros:**
- ✅ Encrypted at rest
- ✅ Not visible in database
- ✅ Secure by default
- ✅ Easy to rotate

**Cons:**
- ⚠️ Need to update Edge Function code
- ⚠️ Can't manage via admin panel easily

### Option 2: Encrypted Database Column

**Encrypt before storing, decrypt when reading.**

**Implementation:**

1. **Store encrypted in database:**
   ```typescript
   // Encrypt before storing
   const encrypted = await encrypt(secretKey, encryptionKey);
   await supabase
     .from("payment_gateways")
     .update({ credentials: { secret_key: encrypted } });
   ```

2. **Decrypt when reading:**
   ```typescript
   const encrypted = gateway.credentials.secret_key;
   const secretKey = await decrypt(encrypted, encryptionKey);
   ```

**Pros:**
- ✅ Can still use admin panel
- ✅ Encrypted in database
- ✅ Flexible

**Cons:**
- ⚠️ Need encryption key management
- ⚠️ More complex implementation

### Option 3: Hybrid Approach (Best for Your Use Case)

**Store access key in database, secret key in Vault.**

**Why:**
- Access key is public (safe to store in DB)
- Secret key is private (store in Vault)

**Implementation:**

1. **Database:**
   ```json
   {
     "access_key": "ak_live_xxxxx"  // Public, safe in DB
   }
   ```

2. **Vault:**
   ```
   ZWITCH_SECRET_KEY=sk_live_xxxxx  // Private, in Vault
   ```

3. **Edge Function:**
   ```typescript
   const accessKey = gateway.credentials.access_key;  // From DB
   const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");  // From Vault
   ```

## Recommended Implementation

### For Your Project: Hybrid Approach

**Why:**
- Access key can be in database (it's public anyway)
- Secret key in Vault (truly private)
- Still manageable via admin panel
- More secure than current setup

**Steps:**

1. **Update database schema:**
   - Keep `access_key` in `credentials` JSONB
   - Remove `secret_key` from database

2. **Store secret key in Vault:**
   ```bash
   supabase secrets set ZWITCH_SECRET_KEY=sk_live_xxxxx
   ```

3. **Update Edge Function:**
   ```typescript
   // Get access key from database
   const accessKey = gateway.credentials.access_key;
   
   // Get secret key from Vault
   const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
   
   if (!secretKey) {
     throw new Error("Zwitch secret key not configured in Vault");
   }
   ```

4. **Update admin panel:**
   - Remove secret key input field
   - Show message: "Secret key configured in Vault"
   - Only allow access key configuration

## Quick Implementation Guide

### Step 1: Store Secret Key in Vault

**Via Supabase Dashboard:**
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Click **"Add Secret"**
3. Name: `ZWITCH_SECRET_KEY`
4. Value: Your secret key (`sk_live_...`)
5. Click **"Save"**

**Via CLI:**
```bash
supabase secrets set ZWITCH_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

### Step 2: Update Edge Function

**In `create-payment-order/index.ts`:**
```typescript
// Get access key from database
const accessKey = config.credentials.access_key;

// Get secret key from Vault
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");

if (!secretKey) {
  throw new Error("Zwitch secret key not configured. Please set ZWITCH_SECRET_KEY in Supabase Vault.");
}
```

### Step 3: Update Admin Panel

**In `PaymentGatewayForm.tsx`:**
- Remove secret key input field
- Add note: "Secret key is stored securely in Supabase Vault"

## Security Best Practices

1. ✅ **Never log secrets** - Don't log secret keys in Edge Function logs
2. ✅ **Use Vault for secrets** - Store truly sensitive data in Vault
3. ✅ **Rotate keys regularly** - Update keys periodically
4. ✅ **Limit access** - Only admins can configure keys
5. ✅ **Monitor access** - Log who accesses/modifies keys

## Current vs Secure Storage

### Current (Plain JSON in DB):
```
Database: payment_gateways.credentials
{
  "access_key": "ak_live_xxxxx",
  "secret_key": "sk_live_xxxxx"  // ⚠️ Plain text
}
```

### Secure (Hybrid):
```
Database: payment_gateways.credentials
{
  "access_key": "ak_live_xxxxx"  // ✅ Public, safe
}

Vault: ZWITCH_SECRET_KEY
sk_live_xxxxx  // ✅ Encrypted, secure
```

## Summary

**Current:** Keys stored as plain JSON in database
**Recommended:** Access key in DB, secret key in Supabase Vault
**Most Secure:** Both keys in Vault (but less convenient)

**For your use case:** Hybrid approach is best balance of security and usability.

