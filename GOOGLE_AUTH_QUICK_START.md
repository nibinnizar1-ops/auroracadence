# Google Auth Quick Start Checklist

## 🚀 Quick Setup (5-10 minutes)

### Part 1: Google Cloud Console (3-5 min)

1. **Go to**: [console.cloud.google.com](https://console.cloud.google.com/)
2. **Create/Select Project** → Enable Google+ API
3. **OAuth Consent Screen**:
   - Type: External
   - App name: Aurora Cadence
   - Your email
   - Save through all steps
4. **Create Credentials**:
   - Type: OAuth 2.0 Client ID
   - Application: Web application
   - **Authorized redirect URIs**: 
     ```
     https://[YOUR-SUPABASE-REF].supabase.co/auth/v1/callback
     ```
   - **Copy Client ID and Client Secret** ⚠️

### Part 2: Supabase Dashboard (2-3 min)

1. **Go to**: [app.supabase.com](https://app.supabase.com/)
2. **Get Project URL**: Settings → API → Copy Project URL
3. **Enable Google Provider**:
   - Authentication → Providers → Google → Toggle ON
   - Paste Client ID and Client Secret
   - Save
4. **Add Redirect URL**:
   - Authentication → URL Configuration
   - Add: `http://localhost:5173/auth/callback`

### Part 3: Back to Google Cloud (1 min)

1. **Add Supabase Redirect URI** to your OAuth credentials:
   - APIs & Services → Credentials → Your OAuth Client
   - Add: `https://[YOUR-SUPABASE-REF].supabase.co/auth/v1/callback`
   - Save

### Part 4: Test (1 min)

1. Run: `npm run dev`
2. Click "Sign in with Google" button
3. Sign in with Google
4. ✅ Should redirect back and log you in!

---

## 🔑 Important URLs to Copy

### From Supabase Dashboard:
- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **Project Reference**: The part between `https://` and `.supabase.co`

### From Google Cloud Console:
- **Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

---

## ⚠️ Common Mistakes to Avoid

1. ❌ Wrong redirect URI format
   - ✅ Correct: `https://[REF].supabase.co/auth/v1/callback`
   - ❌ Wrong: `https://[REF].supabase.co/auth/callback` (missing `/v1`)

2. ❌ Mismatched URLs
   - Make sure the redirect URI in Google matches exactly what Supabase expects

3. ❌ Forgetting to enable the provider
   - Google provider must be toggled ON in Supabase

4. ❌ Wrong environment
   - Make sure you're using the correct Supabase project (dev vs prod)

---

## 📝 Where to Find Things

### Supabase Project Reference:
- Dashboard → Settings → API → Project URL
- Look for: `https://[THIS-PART].supabase.co`

### Google OAuth Credentials:
- Google Cloud Console → APIs & Services → Credentials
- Look for "OAuth 2.0 Client ID"

### Supabase Auth Settings:
- Dashboard → Authentication → Providers
- Dashboard → Authentication → URL Configuration

---

## 🆘 Quick Troubleshooting

| Error | Solution |
|-------|----------|
| `redirect_uri_mismatch` | Check redirect URI matches exactly in Google Cloud Console |
| `Invalid client` | Verify Client ID/Secret in Supabase match Google Cloud Console |
| Not redirecting | Check redirect URL in Supabase matches `http://localhost:5173/auth/callback` |
| User not logged in | Check browser console, verify `initializeAuth()` is called |

---

## ✅ Final Checklist

- [ ] Google OAuth credentials created
- [ ] Supabase project URL copied
- [ ] Google provider enabled in Supabase
- [ ] Client ID & Secret added to Supabase
- [ ] Redirect URI added to Supabase: `http://localhost:5173/auth/callback`
- [ ] Supabase redirect URI added to Google: `https://[REF].supabase.co/auth/v1/callback`
- [ ] Tested sign-in flow

**That's it! You're ready to go! 🎉**

