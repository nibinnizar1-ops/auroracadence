# Admin Dashboard - Troubleshooting Guide

## 🔍 Quick Diagnosis

### Step 1: Check the URL

**❌ Wrong:** `http://localhost:5173`  
**✅ Correct:** `http://localhost:5173/admin`

The admin dashboard is at `/admin`, not the root URL.

---

### Step 2: What Do You See?

**A) Home Page (Aurora Cadence website)**
- **Problem**: You're not signed in OR you're accessing the wrong URL
- **Solution**: 
  1. Make sure you're signed in
  2. Navigate to: `http://localhost:5173/admin`

**B) "Checking admin access..." (Loading spinner)**
- **Problem**: Admin check is running but taking too long
- **Solution**: 
  1. Open browser console (F12)
  2. Check for errors
  3. Verify `is_admin()` function exists in database

**C) "Access Denied" message**
- **Problem**: You're signed in but not an admin
- **Solution**: Add your user to `admin_users` table (see below)

**D) Blank page or error**
- **Problem**: Code error or missing dependencies
- **Solution**: Check browser console (F12) for errors

---

## 🛠️ Step-by-Step Fix

### Fix 1: Verify Admin User Setup

**1. Check if you have an admin user:**

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Check if admin_users table exists and has data
SELECT * FROM public.admin_users;
```

**2. If empty, add your user:**

```sql
-- First, get your user ID from Authentication → Users
-- Then run this (replace with your actual values):
INSERT INTO public.admin_users (user_id, email)
VALUES (
  'your-user-id-here',  -- Get from Authentication → Users
  'your-email@example.com'  -- Your email
);
```

**3. Verify the is_admin function exists:**

```sql
-- Check if function exists
SELECT proname FROM pg_proc WHERE proname = 'is_admin';

-- If it doesn't exist, you need to run the migration:
-- supabase/migrations/20250101000010_create_admin_users_table.sql
```

---

### Fix 2: Check Browser Console

1. **Open browser console:**
   - Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Go to "Console" tab

2. **Look for errors:**
   - Red errors = problem
   - Share the error message if you see any

3. **Common errors:**
   - `Function is_admin does not exist` → Run migration
   - `Permission denied` → Check RLS policies
   - `Network error` → Check Supabase connection

---

### Fix 3: Verify You're Signed In

1. **Check if you're signed in:**
   - Look at the top navigation
   - Do you see your name/email or "Sign In" button?

2. **If not signed in:**
   - Click "Sign In"
   - Sign in with your admin credentials
   - Then navigate to `/admin`

---

### Fix 4: Test Admin Access Directly

**Run this in browser console (F12):**

```javascript
// Test if admin check works
fetch('http://localhost:5173/admin')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.error('Error:', e));
```

**Or test the admin function directly:**

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run (replace with your user ID):

```sql
-- Test if is_admin function works
SELECT public.is_admin('your-user-id-here');
```

Should return `true` if you're an admin, `false` if not.

---

## 📋 Complete Checklist

Go through each item:

- [ ] Dev server is running (`npm run dev`)
- [ ] Can access `http://localhost:5173` (home page loads)
- [ ] Signed in with admin account
- [ ] User exists in `admin_users` table
- [ ] `is_admin()` function exists in database
- [ ] Navigating to `http://localhost:5173/admin` (not just `/`)
- [ ] No errors in browser console (F12)
- [ ] No errors in terminal

---

## 🎯 Quick Test Steps

**1. Test Home Page:**
```
http://localhost:5173
```
Should show: Aurora Cadence home page

**2. Sign In:**
- Click "Sign In" button
- Sign in with your admin credentials

**3. Test Admin Route:**
```
http://localhost:5173/admin
```
Should show: Admin Dashboard OR "Access Denied" OR "Checking admin access..."

**4. Check What You See:**
- **Admin Dashboard** → ✅ Success!
- **"Checking admin access..."** → Wait a few seconds, check console
- **"Access Denied"** → Add user to admin_users table
- **Home page redirect** → You're not signed in
- **Error page** → Check console for errors

---

## 🔧 Common Issues & Solutions

### Issue 1: "Checking admin access..." Forever

**Problem**: Admin check is stuck

**Solution**:
1. Open browser console (F12)
2. Check Network tab → Look for failed requests
3. Verify Supabase connection in `.env` file
4. Check if `is_admin()` function exists:

```sql
SELECT public.is_admin('your-user-id');
```

### Issue 2: Redirected to Home Page

**Problem**: Not signed in or not admin

**Solution**:
1. Make sure you're signed in
2. Check if user is in admin_users table
3. Try signing out and signing back in

### Issue 3: "Function is_admin does not exist"

**Problem**: Migration not applied

**Solution**:
1. Go to Supabase Dashboard → SQL Editor
2. Run the migration: `supabase/migrations/20250101000010_create_admin_users_table.sql`
3. Or manually create the function (see migration file)

### Issue 4: Blank Page

**Problem**: Code error

**Solution**:
1. Check browser console (F12) for errors
2. Check terminal for build errors
3. Try refreshing the page
4. Clear browser cache

---

## 🆘 Still Not Working?

**Share these details:**

1. **What URL are you accessing?**
   - `http://localhost:5173` or `http://localhost:5173/admin`?

2. **What do you see?**
   - Home page?
   - "Access Denied"?
   - "Checking admin access..."?
   - Error message?
   - Blank page?

3. **Browser console errors:**
   - Press F12 → Console tab
   - Copy any red error messages

4. **Are you signed in?**
   - Yes/No
   - What email are you using?

5. **Terminal output:**
   - Any errors in the terminal where `npm run dev` is running?

---

## ✅ Expected Behavior

**When everything works:**

1. Navigate to `http://localhost:5173/admin`
2. See "Checking admin access..." for 1-2 seconds
3. Admin Dashboard appears with:
   - Left sidebar with navigation
   - 4 stats cards (Products, Orders, Returns, Coupons)
   - "Admin Panel - Aurora Cadence" header

**If you see this, you're all set!** 🎉

---

**Let me know what you see and I'll help you fix it!** 🚀



