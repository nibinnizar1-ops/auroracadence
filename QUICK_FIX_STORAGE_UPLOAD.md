# Quick Fix: "new row violates row-level security policy" Error

## The Problem
The RLS (Row Level Security) policy is blocking your upload because it can't verify you're an admin in the storage context.

## Solution 1: Run the Migration (Recommended)

Run this migration file in your Supabase SQL Editor:
- File: `supabase/migrations/20250113000010_fix_storage_rls.sql`

This will update the RLS policies to work better with storage.

## Solution 2: Verify Your Admin Status

First, check if you're in the admin_users table:

```sql
-- Check your user ID
SELECT auth.uid() as current_user_id;

-- Check if you're in admin_users
SELECT * FROM admin_users WHERE user_id = auth.uid();
```

If you're NOT in the table, add yourself:

```sql
-- Get your email (replace with your actual email)
-- Then add yourself as admin
INSERT INTO admin_users (user_id, email)
VALUES (
  auth.uid(),  -- Your current user ID
  'your-email@example.com'  -- Replace with your email
)
ON CONFLICT (user_id) DO NOTHING;
```

## Solution 3: Temporary Workaround (For Testing Only)

If you need to test immediately, you can temporarily allow all authenticated users to upload:

```sql
-- WARNING: This allows ANY authenticated user to upload
-- Only use for testing, then revert!

DROP POLICY IF EXISTS "Admin can upload product-images" ON storage.objects;

CREATE POLICY "Temporary: Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

**Remember to revert this after testing!**

## Solution 4: Check if is_admin Function Works

Test if the is_admin function works:

```sql
-- This should return true if you're an admin
SELECT public.is_admin(auth.uid());
```

If it returns `false` or `null`, you need to add yourself to the admin_users table (see Solution 2).

## After Fixing

1. Refresh your admin panel
2. Try uploading an image again
3. Check the browser console (F12) for any remaining errors

