# Google Authentication Setup Guide

This guide will walk you through setting up Google OAuth authentication for your Aurora Cadence application.

## Prerequisites
- A Supabase project (already set up)
- A Google account
- Access to your Supabase Dashboard

---

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 1.2 Create or Select a Project
1. Click on the project dropdown at the top
2. Either:
   - **Select an existing project**, OR
   - **Create a new project**:
     - Click "New Project"
     - Enter project name: "Aurora Cadence" (or any name)
     - Click "Create"
     - Wait for project creation (may take a few seconds)

### 1.3 Enable Google+ API
1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click on it and click **"Enable"** (if not already enabled)

### 1.4 Configure OAuth Consent Screen
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: Aurora Cadence (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On **"Scopes"** page, click **"Save and Continue"** (default scopes are fine)
7. On **"Test users"** page (if in testing mode), you can add test users or skip
8. Click **"Save and Continue"**
9. Review and click **"Back to Dashboard"**

### 1.5 Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. Choose application type: **"Web application"**
5. Fill in the details:
   - **Name**: Aurora Cadence Web Client (or any name)
   - **Authorized JavaScript origins**: 
     - For development: `http://localhost:5173`
     - For production: `https://yourdomain.com` (add your actual domain)
   - **Authorized redirect URIs**: 
     - **IMPORTANT**: Get your Supabase project URL first (see Step 2.1)
     - Format: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
6. Click **"Create"**
7. **Copy the Client ID and Client Secret** - you'll need these in the next step
   - ⚠️ **Keep the Client Secret safe - don't share it publicly!**

---

## Step 2: Configure Supabase

### 2.1 Get Your Supabase Project URL
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **"Settings"** → **"API"**
4. Copy your **"Project URL"** (looks like: `https://abcdefghijklmnop.supabase.co`)
5. You'll need this for the redirect URI in Google Cloud Console

### 2.2 Enable Google Provider in Supabase
1. In Supabase Dashboard, go to **"Authentication"** → **"Providers"**
2. Find **"Google"** in the list
3. Toggle it **ON** (enable it)
4. Fill in the credentials:
   - **Client ID (for OAuth)**: Paste the Client ID from Step 1.5
   - **Client Secret (for OAuth)**: Paste the Client Secret from Step 1.5
5. Click **"Save"**

### 2.3 Configure Redirect URLs in Supabase
1. Still in **"Authentication"** → **"URL Configuration"**
2. Under **"Redirect URLs"**, add:
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback` (when you deploy)
3. Click **"Save"**

### 2.4 Verify Site URL
1. In **"Authentication"** → **"URL Configuration"**
2. Check that **"Site URL"** is set correctly:
   - Development: `http://localhost:5173`
   - Production: `https://yourdomain.com` (when you deploy)

---

## Step 3: Update Google Cloud Console with Supabase Redirect URI

### 3.1 Add Supabase Redirect URI
1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **"APIs & Services"** → **"Credentials"**
3. Click on the OAuth 2.0 Client ID you created
4. Under **"Authorized redirect URIs"**, add:
   - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   - Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference
5. Click **"Save"**

---

## Step 4: Test the Implementation

### 4.1 Start Your Development Server
```bash
npm run dev
# or
yarn dev
```

### 4.2 Test Google Sign-In
1. Open your app in the browser (usually `http://localhost:5173`)
2. Click on the login/signup button
3. You should see a **"Sign in with Google"** button
4. Click the button
5. You should be redirected to Google's sign-in page
6. After signing in with Google, you should be redirected back to your app
7. You should be logged in successfully!

### 4.3 Verify User Data
1. After logging in, go to your profile page
2. Check that your name and email are displayed correctly
3. The email should be from your Google account

---

## Step 5: Troubleshooting

### Issue: "redirect_uri_mismatch" Error
**Solution**: 
- Make sure the redirect URI in Google Cloud Console exactly matches: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
- Check that there are no trailing slashes or typos

### Issue: "Invalid client" Error
**Solution**:
- Verify that the Client ID and Client Secret in Supabase match exactly what's in Google Cloud Console
- Make sure there are no extra spaces when copying/pasting

### Issue: OAuth Consent Screen Shows "Unverified App"
**Solution**:
- This is normal for development/testing
- Users will see a warning but can still proceed by clicking "Advanced" → "Go to [Your App] (unsafe)"
- To remove the warning, you need to verify your app with Google (requires app verification process)

### Issue: Redirect Not Working After Google Sign-In
**Solution**:
- Check that the redirect URL in Supabase matches: `http://localhost:5173/auth/callback`
- Verify the route exists in your App.tsx (it should - we added it)
- Check browser console for any errors

### Issue: User Not Logged In After Redirect
**Solution**:
- Check browser console for errors
- Verify that `initializeAuth()` is being called in App.tsx
- Check Supabase Dashboard → Authentication → Users to see if the user was created

---

## Step 6: Production Deployment

When you're ready to deploy to production:

### 6.1 Update Google Cloud Console
1. Add your production domain to **"Authorized JavaScript origins"**
2. Add your production redirect URI: `https://yourdomain.com/auth/callback`

### 6.2 Update Supabase
1. Add production redirect URL: `https://yourdomain.com/auth/callback`
2. Update Site URL to your production domain

### 6.3 Update Environment Variables
Make sure your production environment has:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## Quick Checklist

- [ ] Google Cloud Console project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created (Client ID & Secret)
- [ ] Supabase project URL obtained
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] Supabase redirect URI added to Google Cloud Console
- [ ] Tested sign-in flow in development
- [ ] Production URLs configured (when ready)

---

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase Dashboard → Authentication → Logs
3. Verify all URLs match exactly (no typos, correct format)
4. Make sure you're using the correct project reference in all URLs

---

**You're all set!** 🎉 Your Google authentication should now be working.

