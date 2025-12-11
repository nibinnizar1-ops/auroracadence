# Alternative Admin Setup (Without Profiles Table)

Since you have restrictions on creating the profiles table, here are two alternatives:

---

## Option 1: Create Table via Supabase Dashboard UI (Recommended)

You can create the `profiles` table using the visual Table Editor instead of SQL:

### Steps:

1. **Go to Table Editor** in Supabase Dashboard
2. **Click "New Table"**
3. **Table name**: `profiles`
4. **Add columns**:
   - `id` (UUID, Primary Key, Foreign Key → `auth.users.id`)
   - `email` (Text)
   - `full_name` (Text)
   - `avatar_url` (Text)
   - `phone` (Text)
   - `is_admin` (Boolean, Default: false)
   - `created_at` (Timestamp, Default: now())
   - `updated_at` (Timestamp, Default: now())

5. **Enable RLS**: Check the "Enable Row Level Security" checkbox
6. **Click "Create Table"**

Then you can run the admin support migration to add the function.

---

## Option 2: Standalone Admin Users Table (No Profiles Required)

This creates a separate `admin_users` table that doesn't depend on profiles:

### Create this table instead:

```sql
-- Create standalone admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view admin_users
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid()
  )
);

-- Function to check if user is admin (using admin_users table)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;
```

### To add an admin user:

```sql
-- Replace 'user-uuid-here' with the actual user ID from auth.users
-- Replace 'admin@example.com' with the admin email

INSERT INTO public.admin_users (user_id, email)
VALUES (
  'user-uuid-here',  -- Get this from Authentication → Users in Dashboard
  'admin@example.com'
);
```

---

## Option 3: Use User Metadata (Simplest)

Store admin status in Supabase Auth user metadata instead of a table:

### Update storage policies to use metadata:

```sql
-- Function to check if user is admin (using user metadata)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_metadata JSONB;
BEGIN
  SELECT raw_user_meta_data INTO user_metadata
  FROM auth.users
  WHERE id = user_metadata;
  
  RETURN COALESCE((user_metadata->>'is_admin')::boolean, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, anon;
```

### To make a user admin:

1. Go to **Authentication** → **Users** in Dashboard
2. Click on the user
3. In **User Metadata**, add:
   ```json
   {
     "is_admin": true
   }
   ```
4. Save

---

## Which Option Should You Use?

- **Option 1**: If you can use Dashboard UI to create tables
- **Option 2**: If you need a separate admin system (recommended for multiple admins)
- **Option 3**: If you want the simplest solution (good for 1-2 admins)

---

## Recommendation

I recommend **Option 2** (standalone admin_users table) because:
- ✅ No dependency on profiles table
- ✅ Clean separation of admin users
- ✅ Easy to manage multiple admins
- ✅ Works with existing storage policies

Would you like me to create a migration file for Option 2?

