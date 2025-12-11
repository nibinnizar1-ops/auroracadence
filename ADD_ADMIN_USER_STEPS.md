# Step-by-Step: Add Admin User

## Option 1: Use Your Existing User (Quickest)

I can see you already have a user: **Nibin NiZar** (`nibin.nizar1@gmail.com`)

### Step 1: Copy the User ID

1. In the Users table, find your user: **Nibin NiZar**
2. Click on the **UID** column: `268f3722-0f16-4a06-a996-1d33cc0849ea`
3. **Copy this UUID** (you'll need it in the next step)

### Step 2: Add to Admin Table

Go to **SQL Editor** in Supabase Dashboard and run:

```sql
INSERT INTO public.admin_users (user_id, email)
VALUES (
  '268f3722-0f16-4a06-a996-1d33cc0849ea',  -- Your User ID
  'nibin.nizar1@gmail.com'  -- Your email
);
```

**Click "Run"** ✅

---

## Option 2: Create a New Admin User

### Step 1: Create New User

1. In the **Users** section, click the green **"Add user"** button
2. Select **"Create new user"** from the dropdown
3. Fill in the form:
   - **Email**: `admin@auroracadence.com` (or your preferred admin email)
   - **Password**: Create a strong password (you'll need this to sign in)
   - **Auto Confirm User**: ✅ **Check this box** (important!)
4. Click **"Create user"**

### Step 2: Get the User ID

After creating the user:

1. The new user will appear in the Users table
2. Click on the user row to open their details
3. At the top of the user details page, you'll see the **UID** (UUID)
4. **Copy this UUID**

**OR** you can see it in the table - it's in the **UID** column.

### Step 3: Add to Admin Table

Go to **SQL Editor** and run:

```sql
INSERT INTO public.admin_users (user_id, email)
VALUES (
  'paste-the-user-id-here',  -- Paste the UUID you copied
  'admin@auroracadence.com'  -- The email you used
);
```

**Click "Run"** ✅

---

## Verify Admin User Was Added

Run this SQL to check:

```sql
SELECT * FROM public.admin_users;
```

You should see your admin user listed! ✅

---

## Test Admin Access

1. **Sign out** of your current session (if signed in)
2. **Sign in** with your admin credentials:
   - Email: `nibin.nizar1@gmail.com` (or the new admin email)
   - Password: (your password)
3. Try uploading an image to the `product-images` bucket
4. If it works, you're all set! 🎉

---

## Troubleshooting

### "duplicate key value violates unique constraint"
**Solution**: User is already in admin_users table. You're done! ✅

### "insert or update on table violates foreign key constraint"
**Solution**: 
- Make sure the user_id matches exactly (copy-paste, don't type)
- Make sure the user exists in Authentication → Users first

### Can't find User ID
**Solution**: 
- Click on the user row in the table
- The UID is shown at the top of the user details page
- Or look in the UID column of the table

---

## Quick Reference

**Your existing user:**
- **UID**: `268f3722-0f16-4a06-a996-1d33cc0849ea`
- **Email**: `nibin.nizar1@gmail.com`

**SQL to add this user as admin:**
```sql
INSERT INTO public.admin_users (user_id, email)
VALUES (
  '268f3722-0f16-4a06-a996-1d33cc0849ea',
  'nibin.nizar1@gmail.com'
);
```

