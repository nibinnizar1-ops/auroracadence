# User Data with Google Sign-In - Explanation

## 🔍 Where Google Sign-In Users Are Stored

When users sign in with Google, Supabase automatically stores them in the **`auth.users`** table, which is in the **`auth`** schema (not the `public` schema).

### Why You Can't See Them in Table Editor

- The `auth` schema is **hidden** in the Table Editor by default
- It's a system schema managed by Supabase Auth
- User data is there, but you need to access it differently

---

## ✅ Solution: Create a Profiles Table

I've created a migration that:

1. **Creates a `profiles` table** in the `public` schema (visible in Table Editor)
2. **Automatically syncs** user data from `auth.users` to `profiles`
3. **Creates a profile** automatically when a user signs up with Google
4. **Updates the profile** when user metadata changes

---

## 📋 How to Apply

### Step 1: Run the Migration

1. Go to **SQL Editor** in Supabase Dashboard
2. Open this file: `supabase/migrations/20250101000006_create_profiles_table.sql`
3. Copy all the SQL
4. Paste into SQL Editor
5. Click **"Run"**

### Step 2: Verify

After running the migration:

1. Go to **Table Editor**
2. You should see a new table: **`profiles`**
3. When a user signs in with Google, a profile will be automatically created!

---

## 🔍 How to View Users

### Method 1: View in Supabase Dashboard

1. Go to **Authentication** → **Users** (in left sidebar)
2. You'll see all users who signed in (including Google users)
3. Click on a user to see their details

### Method 2: View Profiles Table

1. Go to **Table Editor**
2. Click on **`profiles`** table
3. You'll see all user profiles with:
   - `id` (matches auth.users id)
   - `email`
   - `full_name`
   - `avatar_url`
   - `phone` (if provided)
   - Other profile fields

---

## 🔄 How It Works

### When User Signs In with Google:

1. **Supabase Auth** creates/updates user in `auth.users`
2. **Trigger fires** → `handle_new_user()` function runs
3. **Profile created** in `public.profiles` table automatically
4. **Data synced** from Google (name, email, avatar)

### When User Updates Profile:

1. User updates their profile in your app
2. Profile updated in `public.profiles` table
3. (Optional) Can also update `auth.users` metadata

---

## 📊 Current Data Flow

```
Google Sign-In
    ↓
Supabase Auth (auth.users)
    ↓
Trigger: handle_new_user()
    ↓
Profiles Table (public.profiles) ← YOU CAN SEE THIS!
    ↓
Your App (fetches from profiles table)
```

---

## 🎯 Benefits

1. ✅ **Visible in Table Editor** - You can see all users
2. ✅ **Easy to Query** - Join with orders, coupons, etc.
3. ✅ **Automatic Sync** - No manual work needed
4. ✅ **Additional Fields** - Can add custom profile fields
5. ✅ **RLS Policies** - Users can only see/edit their own profile

---

## 🔍 Check Existing Users

If you already have users who signed in:

1. Run the migration first
2. Then run this SQL to create profiles for existing users:

```sql
-- Create profiles for existing users
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', raw_user_meta_data->>'picture')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
```

---

## ✅ After Migration

You'll be able to:

1. ✅ See all users in **Table Editor** → `profiles` table
2. ✅ Query users easily: `SELECT * FROM profiles`
3. ✅ Join with orders: `SELECT * FROM orders JOIN profiles ON orders.user_id = profiles.id`
4. ✅ View user details in your app

---

**Run the migration and you'll be able to see all your Google sign-in users!** 🎉

