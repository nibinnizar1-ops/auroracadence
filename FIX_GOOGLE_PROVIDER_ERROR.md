# Fix: "Unsupported provider: provider is not enabled"

This error means the Google OAuth provider is not enabled in your Supabase project.

## Quick Fix (2 minutes)

### Step 1: Go to Supabase Dashboard
1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (the one with URL: `https://wkvotycwrvimfiacbsjk.supabase.co`)

### Step 2: Enable Google Provider
1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** (or go directly to: Authentication → Providers)
3. Scroll down to find **"Google"** in the list of providers
4. **Toggle the switch to ON** (it should turn blue/green when enabled)

### Step 3: Add Google OAuth Credentials
After enabling, you'll see fields for:
- **Client ID (for OAuth)**
- **Client Secret (for OAuth)**

**If you already have Google OAuth credentials:**
- Paste your Client ID
- Paste your Client Secret
- Click **"Save"**

**If you DON'T have Google OAuth credentials yet:**
- You need to create them first in Google Cloud Console
- Follow the guide in `GOOGLE_AUTH_SETUP.md` or `GOOGLE_AUTH_QUICK_START.md`
- Then come back here and add them

### Step 4: Configure Redirect URL
1. Still in Supabase Dashboard, go to **"Authentication"** → **"URL Configuration"**
2. Under **"Redirect URLs"**, add:
   ```
   http://localhost:8080/auth/callback
   ```
   (Note: Your app runs on port 8080, not 5173)
3. Click **"Save"**

### Step 5: Test Again
1. Go back to your app at `http://localhost:8080`
2. Click "Sign in with Google"
3. It should work now! ✅

---

## Visual Guide

### Where to Find "Providers" in Supabase:
```
Supabase Dashboard
  └── Authentication (left sidebar)
      └── Providers (tab at the top)
          └── Google (scroll down to find it)
              └── Toggle switch (turn it ON)
```

### What It Should Look Like:
- **Before**: Google provider toggle is OFF (gray/white)
- **After**: Google provider toggle is ON (blue/green)
- **Fields appear**: Client ID and Client Secret input fields

---

## Common Issues

### Issue: "I don't see the Google provider"
**Solution**: 
- Make sure you're in the correct Supabase project
- Check that you're looking at "Providers" under "Authentication"
- Some providers might be collapsed - scroll down or expand sections

### Issue: "I don't have Google OAuth credentials"
**Solution**:
- You need to create them in Google Cloud Console first
- See `GOOGLE_AUTH_SETUP.md` for detailed instructions
- Or use `GOOGLE_AUTH_QUICK_START.md` for a quick version

### Issue: "Still getting the error after enabling"
**Solution**:
- Make sure you clicked "Save" after enabling
- Wait a few seconds for changes to propagate
- Refresh your browser and try again
- Check that you're using the correct Supabase project

---

## Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to Authentication → Providers
- [ ] Found Google provider
- [ ] Toggled Google provider to ON
- [ ] Added Client ID (if you have it)
- [ ] Added Client Secret (if you have it)
- [ ] Clicked "Save"
- [ ] Added redirect URL: `http://localhost:8080/auth/callback`
- [ ] Tested sign-in again

---

**That's it!** Once you enable the Google provider in Supabase, the error should be resolved.

