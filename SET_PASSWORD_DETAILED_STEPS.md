# How to Set Password - Detailed Steps

## Why You Don't See Password Column

The password column is **not visible in the table** for security reasons. You need to **click on the user** to open their details page where you can set the password.

---

## Step-by-Step Instructions

### Step 1: Click on the User Row

1. In the **Users** table, find your user: **Nibin NiZar**
2. **Click anywhere on that row** (not just the checkbox)
   - You can click on the name, email, or any part of the row
3. This will open the **user details page**

### Step 2: Find Password Section

On the user details page, you'll see several sections:

1. **User Information** (at the top)
   - UID
   - Email
   - Display name
   - etc.

2. Scroll down or look for:
   - **"Password"** section
   - **"Security"** section
   - **"Authentication"** section

### Step 3: Set Password

1. In the Password section, you'll see:
   - A button that says **"Set password"** or **"Update password"** or **"Reset password"**
   - OR a field where you can enter a new password

2. Click the button or enter a new password

3. **Enter your password** (make it strong!)

4. Click **"Save"** or **"Update"**

---

## Alternative: If You Don't See Password Option

If you can't find the password option in the user details:

### Option A: Use "Send password reset email"

1. In the user details page
2. Look for **"Send password reset email"** button
3. Click it
4. Check the user's email (`nibin.nizar1@gmail.com`)
5. Click the reset link
6. Set a new password

### Option B: Use SQL to Set Password (Advanced)

⚠️ **Note**: This requires the user to reset password on first login

```sql
-- This will send a password reset email
-- User must click the link to set password
UPDATE auth.users
SET 
  encrypted_password = crypt('temporary-password', gen_salt('bf')),
  email_confirmed_at = now()
WHERE email = 'nibin.nizar1@gmail.com';
```

**Better approach**: Use Supabase Dashboard UI or password reset email.

---

## Visual Guide

```
Users Table View:
┌─────────────────────────────────────────────┐
│ [✓] [👤] UID | Name | Email | Providers     │
├─────────────────────────────────────────────┤
│ [ ] [👤] ... | Nibin NiZar | ... | Google  │ ← CLICK HERE
└─────────────────────────────────────────────┘
                    ↓
         User Details Page Opens
                    ↓
┌─────────────────────────────────────────────┐
│ User Information                            │
│ UID: 268f3722-...                           │
│ Email: nibin.nizar1@gmail.com                │
│                                              │
│ Password Section:                            │
│ [Set password] button ← CLICK THIS          │
│                                              │
│ Or:                                          │
│ [Send password reset email] button          │
└─────────────────────────────────────────────┘
```

---

## Still Can't Find It?

### Check These Locations:

1. **User Details Page** (after clicking user):
   - Look for tabs: "Overview", "Security", "Settings"
   - Click "Security" tab

2. **Actions Menu**:
   - Look for a **"..."** (three dots) menu
   - Or an **"Actions"** dropdown
   - Password options might be there

3. **Right Sidebar**:
   - Some Supabase versions show actions in a right sidebar
   - Look for password-related options there

---

## Quick Alternative: Create New User with Password

If setting password is too complicated:

1. **Create a new user** with email/password:
   - Click **"Add user"** → **"Create new user"**
   - Email: `admin@auroracadence.com`
   - Password: (set it here during creation)
   - Auto Confirm: ✅

2. **Add to admin_users table**:
   ```sql
   INSERT INTO public.admin_users (user_id, email)
   VALUES (
     'new-user-id-here',
     'admin@auroracadence.com'
   );
   ```

---

## Need Help?

If you still can't find the password option, try:

1. **Take a screenshot** of the user details page
2. **Check the browser console** for any errors
3. **Try a different browser** (Chrome, Firefox, Safari)
4. **Clear browser cache** and refresh

The password setting should be visible when you click on the user row. Let me know what you see on the user details page!

