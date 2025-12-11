# Fix: redirect_uri_mismatch Error

This error means the redirect URI in Google Cloud Console doesn't match what Supabase is sending.

## 🔍 The Problem

When you click "Sign in with Google", Supabase sends a redirect URI to Google. This must **exactly match** what's configured in Google Cloud Console.

## ✅ Solution: Fix Google Cloud Console Configuration

### Step 1: Go to Google Cloud Console
1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**

### Step 2: Edit Your OAuth Client
1. Click on your **OAuth 2.0 Client ID** (the one you created for Aurora Cadence)
2. Under **"Authorized redirect URIs"**, you need to have:

```
https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback
```

### Step 3: Verify the URI is Correct
⚠️ **CRITICAL**: The URI must be **exactly**:
- ✅ `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
- ❌ NOT `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/call` (missing 'back')
- ❌ NOT `https://rpfvnjaggkhmucosijji.supabase.co/auth/callback` (missing '/v1')
- ❌ NOT `http://localhost:8080/auth/callback` (this is for Supabase, not Google)

### Step 4: Save Changes
1. Click **"Save"** at the bottom
2. Wait 1-2 minutes for changes to propagate

### Step 5: Test Again
1. Clear browser cache (F12 → Application → Clear Storage)
2. Go to your app: `http://localhost:8080`
3. Try "Sign in with Google" again

---

## 📋 Complete Checklist

### Google Cloud Console:
- [ ] OAuth 2.0 Client ID exists
- [ ] **Authorized redirect URIs** includes: `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
- [ ] No typos in the URI
- [ ] Includes `/v1` in the path
- [ ] Uses `https://` (not `http://`)
- [ ] No trailing slash
- [ ] Changes are saved

### Supabase Dashboard:
- [ ] Google provider is enabled
- [ ] Client ID is filled
- [ ] Client Secret is filled
- [ ] Redirect URL `http://localhost:8080/auth/callback` is added (in URL Configuration)
- [ ] Site URL is set to `http://localhost:8080`

---

## 🔍 How OAuth Flow Works

1. **User clicks "Sign in with Google"** in your app
2. **Supabase redirects to Google** with redirect_uri = `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
3. **Google checks** if this URI is in the authorized list
4. **If match**: Google redirects back to Supabase
5. **Supabase processes** the authentication
6. **Supabase redirects** to your app: `http://localhost:8080/auth/callback`

So Google needs the **Supabase callback URL**, not your localhost URL.

---

## 🆘 Still Not Working?

### Check 1: Verify the Exact URI
1. In Google Cloud Console, check the redirect URI character by character
2. Make sure it's: `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
3. No extra spaces, no typos

### Check 2: Wait for Propagation
- Google changes can take 1-2 minutes to propagate
- Wait a bit and try again

### Check 3: Clear Everything
1. Clear browser cache
2. Clear localStorage (F12 → Application → Clear Storage)
3. Try in incognito/private window

### Check 4: Verify Supabase Callback URL
1. In Supabase Dashboard → Authentication → Providers → Google
2. Check the "Callback URL (for OAuth)" field
3. It should show: `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
4. This is the exact URL that needs to be in Google Cloud Console

---

**The fix is simple: Make sure Google Cloud Console has the exact Supabase callback URL!**

