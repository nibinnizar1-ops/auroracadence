# Credential Storage - Recommendation & Plan

## Current Issue

**Problem:** "Could not get merchant details" error
**Possible Cause:** Credentials might not be retrieved correctly from database, or credentials are wrong

**Solution:** Move to environment variables (Supabase Vault) for better security and reliability

## Storage Options Comparison

### Option 1: All in Supabase Vault (Environment Variables) ⭐⭐⭐

**Storage:**
- Access Key → Supabase Vault (`ZWITCH_ACCESS_KEY`)
- Secret Key → Supabase Vault (`ZWITCH_SECRET_KEY`)

**Access:**
```typescript
const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
```

**Pros:**
- ✅ Most secure (encrypted at rest)
- ✅ Never exposed to frontend
- ✅ Standard practice
- ✅ No database dependency
- ✅ Easy to rotate

**Cons:**
- ⚠️ Can't manage via admin panel UI
- ⚠️ Need Supabase Dashboard to update

**Best for:** Production environments, maximum security

---

### Option 2: Hybrid Approach ⭐⭐⭐⭐

**Storage:**
- Access Key → Database (public, safe)
- Secret Key → Supabase Vault (private, encrypted)

**Access:**
```typescript
const accessKey = config.credentials.access_key; // From DB
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY"); // From Vault
```

**Pros:**
- ✅ Secret key encrypted (most secure)
- ✅ Access key manageable via admin panel
- ✅ Best balance of security and usability
- ✅ Access key is public anyway (safe in DB)

**Cons:**
- ⚠️ Two places to manage
- ⚠️ Need to update Vault when changing secret key

**Best for:** Your use case - balance of security and usability

---

### Option 3: All in Database (Current) ⭐⭐

**Storage:**
- Both keys in database (plain JSON)

**Pros:**
- ✅ Manageable via admin panel
- ✅ Easy to update

**Cons:**
- ⚠️ Less secure (plain text in DB)
- ⚠️ Current issue might be related to this

**Best for:** Development/testing only

---

## My Recommendation: Option 1 (All in Vault) ⭐⭐⭐

**Why:**
1. **Most Secure** - Both keys encrypted
2. **Fixes Current Issue** - Eliminates database retrieval problems
3. **Standard Practice** - Industry standard for API keys
4. **Simpler Code** - No database query needed for credentials
5. **Better Performance** - No database lookup

**Trade-off:**
- Can't manage via admin panel (but this is acceptable for security)

---

## Implementation Plan: Option 1 (All in Vault)

### Phase 1: Store Credentials in Supabase Vault

**Step 1: Add Secrets to Supabase**

Via Supabase Dashboard:
1. Go to **Project Settings** → **Edge Functions** → **Secrets**
2. Click **"Add Secret"**
3. Add:
   - Name: `ZWITCH_ACCESS_KEY`
   - Value: Your access key (`ak_live_...`)
   - Save
4. Add:
   - Name: `ZWITCH_SECRET_KEY`
   - Value: Your secret key (`sk_live_...`)
   - Save

Via CLI (alternative):
```bash
supabase secrets set ZWITCH_ACCESS_KEY=ak_live_xxxxx
supabase secrets set ZWITCH_SECRET_KEY=sk_live_xxxxx
```

### Phase 2: Update Edge Function

**Changes:**
1. Remove database credential lookup for Zwitch
2. Read from environment variables instead
3. Keep database lookup for gateway selection (which gateway is active)

**Code Changes:**
```typescript
// OLD: Read from database
const accessKey = config.credentials.access_key;
const secretKey = config.credentials.secret_key;

// NEW: Read from Vault
const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");

if (!accessKey || !secretKey) {
  throw new Error("Zwitch credentials not configured in Supabase Vault. Please set ZWITCH_ACCESS_KEY and ZWITCH_SECRET_KEY.");
}
```

### Phase 3: Update Admin Panel

**Changes:**
1. Remove credential input fields for Zwitch
2. Show message: "Credentials configured in Supabase Vault"
3. Add instructions: "Update in Supabase Dashboard → Edge Functions → Secrets"
4. Keep other gateway configs (Razorpay, PayU, etc.) as they are

### Phase 4: Update verify-payment Function

**Same changes:** Read from environment variables instead of database

---

## Alternative: Option 2 (Hybrid) - If You Want Admin Panel Control

If you want to keep admin panel functionality:

**Storage:**
- Access Key → Database (manageable via admin panel)
- Secret Key → Supabase Vault (encrypted)

**Implementation:**
1. Keep access key in database
2. Move secret key to Vault
3. Edge Function reads from both
4. Admin panel can still manage access key

**Pros:** Best of both worlds
**Cons:** Two places to manage

---

## Recommendation Summary

**For Maximum Security:** Option 1 (All in Vault) ⭐⭐⭐
- Both keys encrypted
- Standard practice
- Fixes current issue

**For Balance:** Option 2 (Hybrid) ⭐⭐⭐⭐
- Secret key encrypted
- Access key manageable via admin panel
- Still secure

**Which do you prefer?**

1. **Option 1** - All in Vault (most secure, no admin panel)
2. **Option 2** - Hybrid (secure + admin panel control)

Let me know and I'll implement it!

