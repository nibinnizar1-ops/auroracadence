# Credential Storage Options - Planning

## Current Implementation

**Storage:** Database (`payment_gateways.credentials` JSONB column)
**Access:** Edge Function reads from database
**Security:** Protected by RLS policies, but stored as plain JSON

## Option 1: Supabase Vault/Secrets (RECOMMENDED) ⭐

### How It Works

**Storage:** Supabase Vault (encrypted environment variables)
**Access:** Edge Function reads via `Deno.env.get()`
**Security:** ✅ Encrypted at rest, ✅ Never exposed to frontend, ✅ Managed by Supabase

### Implementation

**1. Store Secrets in Supabase Dashboard:**
- Go to: Project Settings → Edge Functions → Secrets
- Add secrets:
  - `ZWITCH_ACCESS_KEY` = `ak_live_xxxxx`
  - `ZWITCH_SECRET_KEY` = `sk_live_xxxxx`

**2. Access in Edge Function:**
```typescript
const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
```

**3. Admin Panel:**
- Remove credential input fields
- Show message: "Credentials configured in Supabase Vault"
- Or: Allow admin to update Vault via API (if Supabase supports it)

### Pros
- ✅ Most secure (encrypted)
- ✅ Never exposed to frontend
- ✅ Easy to rotate
- ✅ Standard practice for secrets
- ✅ No database storage needed

### Cons
- ⚠️ Can't manage via admin panel UI (need Supabase Dashboard)
- ⚠️ Need to update Vault manually when changing credentials

---

## Option 2: Hybrid Approach (BEST FOR YOUR USE CASE) ⭐⭐

### How It Works

**Storage:** 
- Access Key → Database (public, safe)
- Secret Key → Supabase Vault (private, secure)

**Access:** Edge Function reads from both
**Security:** ✅ Secret key encrypted, ✅ Access key can be in DB

### Implementation

**1. Database:**
```json
{
  "access_key": "ak_live_xxxxx"  // Public, safe in DB
}
```

**2. Supabase Vault:**
```
ZWITCH_SECRET_KEY=sk_live_xxxxx  // Private, encrypted
```

**3. Edge Function:**
```typescript
// Get access key from database
const accessKey = config.credentials.access_key;

// Get secret key from Vault
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
```

**4. Admin Panel:**
- Access Key input field (saves to DB)
- Secret Key: "Configured in Vault" message
- Or: Secret Key input → saves to Vault via API

### Pros
- ✅ Secret key encrypted (most secure)
- ✅ Access key manageable via admin panel
- ✅ Best balance of security and usability
- ✅ Access key is public anyway (safe in DB)

### Cons
- ⚠️ Two places to manage (DB + Vault)
- ⚠️ Need to update Vault when changing secret key

---

## Option 3: All in Environment Variables

### How It Works

**Storage:** Both keys in Supabase Vault
**Access:** Edge Function reads from environment variables
**Security:** ✅ Both encrypted

### Implementation

**1. Supabase Vault:**
```
ZWITCH_ACCESS_KEY=ak_live_xxxxx
ZWITCH_SECRET_KEY=sk_live_xxxxx
```

**2. Edge Function:**
```typescript
const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");
```

**3. Admin Panel:**
- Remove credential fields
- Show: "Credentials configured in Supabase Vault"
- Instructions: "Update credentials in Supabase Dashboard → Edge Functions → Secrets"

### Pros
- ✅ Most secure (both encrypted)
- ✅ Standard practice
- ✅ Never in database

### Cons
- ⚠️ Can't manage via admin panel
- ⚠️ Need Supabase Dashboard access to change
- ⚠️ Less user-friendly

---

## Option 4: Encrypted Database Storage

### How It Works

**Storage:** Encrypted in database
**Access:** Edge Function decrypts when reading
**Security:** ✅ Encrypted at rest

### Implementation

**1. Encrypt before storing:**
```typescript
const encrypted = await encrypt(secretKey, encryptionKey);
await supabase.from("payment_gateways").update({
  credentials: { secret_key: encrypted }
});
```

**2. Decrypt when reading:**
```typescript
const encrypted = gateway.credentials.secret_key;
const secretKey = await decrypt(encrypted, encryptionKey);
```

### Pros
- ✅ Can manage via admin panel
- ✅ Encrypted in database

### Cons
- ⚠️ Need encryption key management
- ⚠️ More complex implementation
- ⚠️ Encryption key needs to be stored somewhere

---

## Recommendation: Option 2 (Hybrid Approach) ⭐⭐

### Why Hybrid is Best:

1. **Security:** Secret key encrypted in Vault (most secure)
2. **Usability:** Access key manageable via admin panel
3. **Best Practice:** Access key is public anyway (safe in DB)
4. **Flexibility:** Can update access key without touching Vault

### Implementation Plan:

**Phase 1: Move Secret Key to Vault**
1. Add `ZWITCH_SECRET_KEY` to Supabase Vault
2. Update Edge Function to read secret key from Vault
3. Keep access key in database

**Phase 2: Update Admin Panel**
1. Remove secret key input field
2. Add message: "Secret key configured in Supabase Vault"
3. Keep access key input field

**Phase 3: Update Edge Function**
1. Read access key from database
2. Read secret key from Vault
3. Use both in API calls

---

## Comparison Table

| Option | Security | Usability | Complexity | Recommendation |
|--------|----------|-----------|------------|---------------|
| **Option 1: All in Vault** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Good for production |
| **Option 2: Hybrid** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | **BEST** ⭐ |
| **Option 3: All in Env** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Good for production |
| **Option 4: Encrypted DB** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | More complex |

---

## My Recommendation

**Go with Option 2 (Hybrid Approach):**

1. **Secret Key** → Supabase Vault (encrypted, secure)
2. **Access Key** → Database (public, manageable via admin panel)

**Why:**
- ✅ Secret key is most sensitive → Vault is most secure
- ✅ Access key is public → Safe in database
- ✅ Admin panel can still manage access key
- ✅ Best balance of security and usability

**Would you like me to implement Option 2 (Hybrid)?**

