# Admin Setup Guide

## Overview

This guide explains how to set up admin users who can upload product images and manage the store.

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
2. User's profile has `is_admin = true`
3. Storage buckets are created
4. Migration `20250101000009_add_admin_support.sql` is applied

### Can't find user in profiles table

**Solution**: 
- User must sign in at least once to create a profile
- Or manually create profile:
  ```sql
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES ('user-uuid-here', 'admin@example.com', true);
  ```

---

## Next Steps

After setting up admin:
1. ✅ Create storage buckets (see `STORAGE_SETUP_GUIDE.md`)
2. ✅ Run storage migration (`20250101000008_setup_storage_buckets.sql`)
3. ✅ Test image upload
4. ✅ Build admin panel UI (coming next!)

