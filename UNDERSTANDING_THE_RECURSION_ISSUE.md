# Understanding the Infinite Recursion Error

## What Happened?

### The Problem
When you tried to upload an image, you got this error:
```
infinite recursion detected in policy for relation "admin_users"
```

### Root Cause

The issue was caused by **circular RLS (Row Level Security) policy checks**:

1. **Storage Policy** (what we created):
   ```sql
   CREATE POLICY "Admin can upload product-images"
   WITH CHECK (
     bucket_id = 'product-images' 
     AND EXISTS (
       SELECT 1 FROM public.admin_users 
       WHERE admin_users.user_id = auth.uid()
     )
   );
   ```
   This policy says: "Allow upload IF user exists in admin_users table"

2. **admin_users RLS Policy** (already existed):
   ```sql
   CREATE POLICY "Admins can view admin users"
   ON public.admin_users FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM public.admin_users 
       WHERE user_id = auth.uid()
     )
   );
   ```
   This policy says: "Allow viewing admin_users IF user exists in admin_users table"

### The Infinite Loop

When you tried to upload:
1. Storage policy checks: "Is user in admin_users?" → Queries `admin_users` table
2. admin_users RLS kicks in: "Can this user view admin_users?" → Checks "Is user in admin_users?" → Queries `admin_users` table again
3. This creates an infinite loop: checking admin_users requires checking admin_users, which requires checking admin_users... ♾️

```
Storage Policy → Check admin_users → admin_users RLS → Check admin_users → admin_users RLS → Check admin_users → ... (infinite loop)
```

## The Solution

We fixed it by using the `is_admin()` function instead:

```sql
CREATE POLICY "Admin can upload product-images"
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.is_admin(auth.uid()) = true  -- ✅ Uses function instead
);
```

### Why This Works

The `is_admin()` function is marked as `SECURITY DEFINER`:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = is_admin.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- ← This is the key!
```

**`SECURITY DEFINER`** means:
- The function runs with the privileges of the function owner (usually a superuser)
- It **bypasses RLS policies** when executing
- So it can read `admin_users` without triggering the RLS policy check
- This breaks the infinite loop!

## Key Takeaways

1. **RLS policies can create circular dependencies** when they reference tables that also have RLS
2. **SECURITY DEFINER functions** bypass RLS, making them perfect for admin checks
3. **Always use functions for admin checks** in RLS policies, not direct table queries
4. **Test RLS policies** to ensure they don't create infinite loops

## Best Practice

✅ **DO THIS:**
```sql
-- Use SECURITY DEFINER function
AND public.is_admin(auth.uid()) = true
```

❌ **DON'T DO THIS:**
```sql
-- Direct table query (can cause recursion)
AND EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
```

