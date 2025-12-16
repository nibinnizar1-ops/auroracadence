# Fix: Adding Yourself as Admin

## The Problem
`auth.uid()` returns `null` in the SQL Editor because you're not authenticated there. We need to get your actual user ID.

## Solution: Get Your User ID First

### Method 1: From Browser Console (Easiest)

1. **Open your admin panel** in the browser (while logged in)
2. **Open Browser DevTools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Run this JavaScript:**

```javascript
// Get your user ID
const { data: { user } } = await supabase.auth.getUser();
console.log('Your User ID:', user.id);
console.log('Your Email:', user.email);
```

5. **Copy the User ID** that appears in the console
6. **Go back to Supabase SQL Editor** and run:

```sql
-- Replace 'YOUR-USER-ID-HERE' with the ID you copied
-- Replace 'your-email@example.com' with your actual email
INSERT INTO admin_users (user_id, email)
VALUES (
  'YOUR-USER-ID-HERE',  -- Paste your user ID here
  'your-email@example.com'  -- Your actual email
)
ON CONFLICT (user_id) DO NOTHING;
```

### Method 2: From Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Find your user account
3. Copy the **User UID** (it's a long UUID)
4. Run this in SQL Editor:

```sql
INSERT INTO admin_users (user_id, email)
VALUES (
  'PASTE-USER-UID-HERE',  -- The UUID you copied
  'your-actual-email@example.com'  -- Your email
)
ON CONFLICT (user_id) DO NOTHING;
```

### Method 3: Check Existing Users First

If you're not sure which user you are, check all users:

```sql
-- See all auth users
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Then use one of those IDs
INSERT INTO admin_users (user_id, email)
VALUES (
  'USER-ID-FROM-ABOVE-QUERY',
  'EMAIL-FROM-ABOVE-QUERY'
)
ON CONFLICT (user_id) DO NOTHING;
```

## After Adding Yourself

1. Verify you're now an admin:
```sql
SELECT * FROM admin_users;
```

2. Then run the storage RLS policy fix (the DROP/CREATE POLICY statements)

3. Try uploading an image again!

