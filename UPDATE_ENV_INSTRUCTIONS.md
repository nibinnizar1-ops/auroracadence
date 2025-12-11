# Update Environment Variables - Instructions

I've updated your `.env` file with the new project reference: `rpfvnjaggkhmucosijji`

## ⚠️ Action Required: Get Your New Publishable Key

You need to get the new publishable key from your Supabase dashboard:

### Step 1: Get the Publishable Key
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (the one with `rpfvnjaggkhmucosijji`)
3. Go to **Settings** → **API**
4. Under **"Project API keys"**, find the **"anon"** or **"public"** key
5. Copy the key (it starts with `eyJ...`)

### Step 2: Update .env File
1. Open your `.env` file
2. Replace `YOUR_NEW_PUBLISHABLE_KEY_HERE` with the actual key you copied
3. Save the file

### Step 3: Restart Your Dev Server
1. Stop your current dev server (Ctrl + C)
2. Start it again: `npm run dev`
3. The new project configuration will be loaded

---

## ✅ What I've Updated

- ✅ `VITE_SUPABASE_PROJECT_ID` → `rpfvnjaggkhmucosijji`
- ✅ `VITE_SUPABASE_URL` → `https://rpfvnjaggkhmucosijji.supabase.co`
- ⚠️ `VITE_SUPABASE_PUBLISHABLE_KEY` → **YOU NEED TO ADD THIS**

---

## 🔍 Where to Find the Publishable Key

In Supabase Dashboard:
```
Settings → API → Project API keys → anon/public key
```

The key looks like:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZnZuamFnZ2tobXVjb3NpamppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzk2NTEsImV4cCI6MjA3OTkxNTY1MX0.xxxxx
```

---

## 📋 Next Steps After Updating

1. ✅ Update `.env` with the new publishable key
2. ✅ Restart dev server
3. ✅ Configure redirect URL in Supabase:
   - Go to: **Authentication** → **URL Configuration**
   - Add: `http://localhost:8080/auth/callback`
   - Set Site URL: `http://localhost:8080`
4. ✅ Verify Google Cloud Console has:
   - Redirect URI: `https://rpfvnjaggkhmucosijji.supabase.co/auth/v1/callback`
5. ✅ Test Google sign-in

---

**Once you update the publishable key and restart the server, everything should work!**

