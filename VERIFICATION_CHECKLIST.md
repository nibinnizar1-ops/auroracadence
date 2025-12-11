# Google Auth Configuration Verification Checklist

Use this checklist to verify your Google OAuth setup is correct.

## ✅ Supabase Configuration

### 1. Google Provider Enabled
- [ ] Go to: **Supabase Dashboard** → **Authentication** → **Providers**
- [ ] Find **"Google"** in the list
- [ ] Toggle is **ON** (blue/green, not gray)
- [ ] **Client ID** field is filled (should look like: `123456789-xxxxx.apps.googleusercontent.com`)
- [ ] **Client Secret** field is filled (should look like: `GOCSPX-xxxxx`)
- [ ] Clicked **"Save"** button

### 2. Redirect URLs Configured
- [ ] Go to: **Supabase Dashboard** → **Authentication** → **URL Configuration**
- [ ] Under **"Redirect URLs"**, you have:
  - [ ] `http://localhost:8080/auth/callback` (for development)
- [ ] **Site URL** is set to: `http://localhost:8080` (or your production URL)
- [ ] Clicked **"Save"** button

### 3. Project Information
- [ ] Your Supabase Project URL: `https://wkvotycwrvimfiacbsjk.supabase.co`
- [ ] Project Reference: `wkvotycwrvimfiacbsjk`

---

## ✅ Google Cloud Console Configuration

### 1. OAuth Credentials Created
- [ ] Go to: **Google Cloud Console** → **APIs & Services** → **Credentials**
- [ ] You have an **"OAuth 2.0 Client ID"** created
- [ ] Application type is **"Web application"**

### 2. Authorized Redirect URIs
- [ ] In your OAuth Client settings, under **"Authorized redirect URIs"**, you have:
  - [ ] `https://wkvotycwrvimfiacbsjk.supabase.co/auth/v1/callback`
  - [ ] (Optional) `http://localhost:8080/auth/callback` for direct testing
- [ ] **Important**: The Supabase redirect URI must be exactly: `https://wkvotycwrvimfiacbsjk.supabase.co/auth/v1/callback`
- [ ] No trailing slashes
- [ ] Includes `/v1` in the path

### 3. Authorized JavaScript Origins
- [ ] Under **"Authorized JavaScript origins"**, you have:
  - [ ] `http://localhost:8080` (for development)
  - [ ] (Optional) Your production domain

### 4. OAuth Consent Screen
- [ ] OAuth consent screen is configured
- [ ] App name is set
- [ ] Support email is set
- [ ] (If in testing) Test users are added (if needed)

---

## ✅ Code Configuration

### 1. Environment Variables
- [ ] `.env` file exists
- [ ] `VITE_SUPABASE_URL` is set: `https://wkvotycwrvimfiacbsjk.supabase.co`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` is set (starts with `eyJ...`)

### 2. Routes
- [ ] `/auth/callback` route exists in `App.tsx` ✅ (Verified in code)
- [ ] Route points to `AuthCallback` component ✅ (Verified in code)

### 3. Auth Store
- [ ] `signInWithGoogle()` function exists ✅ (Verified in code)
- [ ] Redirect URL uses `window.location.origin` ✅ (Verified in code)

---

## 🧪 Testing Steps

### Test 1: Check Provider Status
1. Open browser console (F12)
2. Go to your app: `http://localhost:8080`
3. Try to sign in with Google
4. Check console for any errors

### Test 2: Verify Redirect
1. Click "Sign in with Google"
2. Should redirect to Google sign-in page
3. After signing in, should redirect back to your app
4. Should see "Successfully signed in!" toast message

### Test 3: Check Session
1. After successful sign-in, go to browser console
2. Type: `localStorage.getItem('sb-wkvotycwrvimfiacbsjk-auth-token')`
3. Should return a token (or check Supabase session)

---

## 🔍 Common Issues to Check

### Issue: "provider is not enabled"
**Check:**
- [ ] Google provider toggle is ON in Supabase
- [ ] You clicked "Save" after enabling
- [ ] Wait 10-30 seconds for changes to propagate
- [ ] Try refreshing the page

### Issue: "redirect_uri_mismatch"
**Check:**
- [ ] Redirect URI in Google Cloud Console exactly matches: `https://wkvotycwrvimfiacbsjk.supabase.co/auth/v1/callback`
- [ ] No typos in the URL
- [ ] Includes `/v1` in the path
- [ ] No trailing slash

### Issue: "Invalid client"
**Check:**
- [ ] Client ID in Supabase matches Google Cloud Console
- [ ] Client Secret in Supabase matches Google Cloud Console
- [ ] No extra spaces when copying/pasting
- [ ] Both fields are filled in Supabase

### Issue: Not redirecting after Google sign-in
**Check:**
- [ ] Redirect URL in Supabase: `http://localhost:8080/auth/callback`
- [ ] Site URL in Supabase: `http://localhost:8080`
- [ ] Route exists in App.tsx ✅ (Already verified)

---

## 📋 Quick Verification Commands

### Check if server is running:
```bash
curl http://localhost:8080
```

### Check environment variables:
```bash
# In your project root
cat .env | grep SUPABASE
```

---

## ✅ Final Checklist

Before testing, make sure:
- [ ] Supabase Google provider is **ON**
- [ ] Client ID and Secret are **filled** in Supabase
- [ ] Redirect URL `http://localhost:8080/auth/callback` is **added** in Supabase
- [ ] Redirect URI `https://wkvotycwrvimfiacbsjk.supabase.co/auth/v1/callback` is **added** in Google Cloud Console
- [ ] All changes are **saved** in both dashboards
- [ ] Dev server is **running** on port 8080
- [ ] Browser is **refreshed** after making changes

---

## 🆘 Still Having Issues?

1. **Clear browser cache and localStorage:**
   - Open browser console (F12)
   - Go to Application tab → Clear Storage → Clear site data
   - Refresh page

2. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs → API Logs
   - Look for authentication errors

3. **Verify in Browser Console:**
   - Open browser console (F12)
   - Try signing in
   - Check for any error messages
   - Share the error message for debugging

4. **Double-check URLs:**
   - Make sure all URLs match exactly (no typos, correct ports, correct paths)

---

**Once all items are checked ✅, your Google authentication should work!**

