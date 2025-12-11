# Admin Setup Guide

## Overview

This guide explains how to set up admin users who can upload product images and manage the store.

## Two Methods Available

### Method 1: Using Profiles Table (if you have access)
- Uses `profiles` table with `is_admin` field
- Migration: `20250101000009_add_admin_support.sql`

### Method 2: Standalone Admin Users Table (Recommended if you have restrictions)
- Uses separate `admin_users` table (no profiles required)
- Migration: `20250101000010_create_admin_users_table.sql`
- **Use this if you can't create the profiles table!**

---

## Method 2: Standalone Admin Users (No Profiles Required)

### Step 1: Run the Migration

Run this migration file:
- `supabase/migrations/20250101000010_create_admin_users_table.sql`

This creates a standalone `admin_users` table that doesn't require the profiles table.

### Step 2: Create Admin User Account

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@auroracadence.com` (or your admin email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**
5. **Copy the User ID** (you'll need it in the next step)

### Step 3: Add User to Admin Table

Run this SQL (replace with your user ID and email):

```sql
INSERT INTO public.admin_users (user_id, email)
VALUES (
  'paste-user-id-here',  -- Get from Authentication → Users → Click user → Copy ID
  'admin@auroracadence.com'  -- Your admin email
);
```

**To get User ID:**
1. Go to **Authentication** → **Users**
2. Click on the user
3. Copy the **UUID** shown at the top

### Step 4: Test Admin Access

1. **Sign in** with the admin credentials
2. **Try uploading** an image to the `product-images` bucket
3. If successful, admin setup is complete! ✅

---

## Method 1: Using Profiles Table (If Available)

## How Admin Authentication Works

1. **Admin users are regular Supabase users** - They sign in with email/password or Google
2. **Admin flag** - A special `is_admin` field in the `profiles` table marks them as admin
3. **Storage policies** - Only users with `is_admin = true` can upload/update/delete images

---

## Step 1: Create Admin User Account

### Option A: Create Admin via Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@auroracadence.com` (or your admin email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

### Option B: Create Admin via SQL

```sql
-- First, create the user in auth.users (you'll need to do this via Dashboard or Supabase Auth API)
-- Then mark them as admin:

UPDATE public.profiles
SET is_admin = true
WHERE email = 'admin@auroracadence.com';
```

---

## Step 2: Mark User as Admin

After creating the user, mark them as admin:

### Via SQL Editor:

```sql
-- Replace 'admin@auroracadence.com' with your admin email
UPDATE public.profiles
SET is_admin = true
WHERE email = 'admin@auroracadence.com';
```

### Via Table Editor:

1. Go to **Table Editor** → **profiles**
2. Find the user by email
3. Set `is_admin` to `true`
4. Save

---

## Step 3: Test Admin Access

1. **Sign in** with the admin credentials
2. **Try uploading** an image to the `product-images` bucket
3. If successful, admin setup is complete! ✅

---

## Creating Multiple Admins

To add more admins, repeat Step 1 and Step 2 for each user.

---

## Security Notes

- ✅ Only users with `is_admin = true` can upload images
- ✅ Regular users can only view images (public read access)
- ✅ Admin status is checked server-side via RLS policies
- ✅ Admin flag cannot be changed by regular users (only via database)

---

## Admin Login Flow

1. Admin goes to your website
2. Clicks "Sign In"
3. Enters email/password (or uses Google if configured)
4. Once authenticated, they can access admin features
5. Storage policies automatically check `is_admin` flag

---

## Troubleshooting

### "Permission denied" when uploading images

**Solution**: Make sure:
1. User is signed in
2. User is added to `admin_users` table (Method 2) OR `is_admin = true` in profiles (Method 1)
3. Storage buckets are created
4. Storage migration is applied

### Can't find user in admin_users table (Method 2)

**Solution**: 
- Make sure you've run the INSERT statement with the correct user_id
- Check that the user_id matches the UUID from Authentication → Users

### Can't find user in profiles table (Method 1)

**Solution**: 
- User must sign in at least once to create a profile
- Or use Method 2 (admin_users table) instead

---

## Next Steps

After setting up admin:
1. ✅ Create storage buckets (see `STORAGE_SETUP_GUIDE.md`)
2. ✅ Run storage migration (`20250101000008_setup_storage_buckets.sql`)
3. ✅ Test image upload
4. ✅ Build admin panel UI (coming next!)

