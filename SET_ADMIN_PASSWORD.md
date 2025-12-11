# Set Password for Admin User

## Current Situation

Your user "Nibin NiZar" is currently signed in via **Google OAuth** (no password set). To log in with email/password, you need to set a password.

---

## Option 1: Set Password for Existing User (Recommended)

### Step 1: Update User in Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Find and **click on** the user: **Nibin NiZar** (`nibin.nizar1@gmail.com`)
3. This opens the user details page

### Step 2: Set Password

1. In the user details page, look for **"Password"** section
2. Click **"Set password"** or **"Update password"** button
3. Enter a **new password** (make it strong!)
4. Click **"Save"** or **"Update"**

### Step 3: Test Login

1. **Sign out** from your current session
2. Go to your website's login page
3. Enter:
   - **Email**: `nibin.nizar1@gmail.com`
   - **Password**: (the password you just set)
4. Click **"Sign In"**

---

## Option 2: Create New Admin User with Password

If you prefer a separate admin account:

### Step 1: Create New User

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@auroracadence.com` (or your preferred admin email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ **Check this**
4. Click **"Create user"**

### Step 2: Get User ID

1. The new user appears in the table
2. **Copy the UID** from the table

### Step 3: Add to Admin Table

Run this SQL (replace with the new user's UID):

```sql
INSERT INTO public.admin_users (user_id, email)
VALUES (
  'paste-new-user-id-here',
  'admin@auroracadence.com'
);
```

---

## Option 3: Use Password Reset (If Available)

If the user already exists but you can't set password directly:

1. Go to **Authentication** → **Users**
2. Click on the user
3. Look for **"Send password reset email"** or **"Reset password"**
4. This will send a password reset link to the user's email
5. User clicks the link and sets a new password

---

## Option 4: Continue Using Google Sign-In

If you prefer, you can continue using **Google sign-in** for admin access:

1. Just sign in with Google (as you're doing now)
2. The `is_admin()` function will check if you're in `admin_users` table
3. You'll have admin access automatically! ✅

**No password needed!**

---

## Recommended Approach

Since you're already signed in with Google and it's working, I recommend:

**Option 4** - Just continue using Google sign-in! It's:
- ✅ More secure (no password to manage)
- ✅ Already working
- ✅ Faster (one-click login)

The admin system will work with Google sign-in - it checks the `admin_users` table, not the authentication method.

---

## If You Must Use Email/Password

If your organization requires email/password login:

1. Use **Option 1** to set a password for the existing user
2. Or use **Option 2** to create a dedicated admin account
3. Then you can sign in with email/password

---

## Verify Admin Access

After setting up, test admin access:

1. Sign in (with password or Google)
2. Try uploading an image to `product-images` bucket
3. If it works, admin setup is complete! ✅

---

## Security Note

- Use a **strong password** (12+ characters, mix of letters, numbers, symbols)
- Consider enabling **2FA/MFA** for extra security
- Don't share admin credentials

