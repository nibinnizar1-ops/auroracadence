# Admin Dashboard - Step-by-Step Access Guide

## 📋 Prerequisites Checklist

Before accessing the admin dashboard, make sure you have:

- [ ] Applied all database migrations
- [ ] Created an admin user in Supabase
- [ ] Added the user to `admin_users` table
- [ ] Know your admin email and password

---

## 🚀 Step-by-Step Guide

### Step 1: Verify Admin User Setup

**Option A: Check if you already have an admin user**

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Check if you have a user with admin privileges
3. If yes, note the email address
4. If no, proceed to Step 2

**Option B: Create a new admin user**

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: `admin@auroracadence.com` (or your preferred email)
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**
5. **Copy the User ID** (you'll need it in the next step)

### Step 2: Add User to Admin Table

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL (replace with your user ID and email):

```sql
-- Check if admin_users table exists
SELECT * FROM public.admin_users;

-- If empty, add your admin user
INSERT INTO public.admin_users (user_id, email)
VALUES (
  'paste-your-user-id-here',  -- Get from Authentication → Users → Click user → Copy ID
  'admin@auroracadence.com'    -- Your admin email
)
ON CONFLICT (user_id) DO NOTHING;
```

**To get User ID:**
- Go to **Authentication** → **Users**
- Click on your user
- Copy the **UUID** shown at the top

### Step 3: Verify Admin Function Exists

Run this SQL to check:

```sql
-- Check if is_admin function exists
SELECT proname FROM pg_proc WHERE proname = 'is_admin';

-- If it doesn't exist, you need to run the admin_users migration
```

If the function doesn't exist, make sure you've run:
- `supabase/migrations/20250101000010_create_admin_users_table.sql`

### Step 4: Start Your Development Server

1. Open terminal in your project directory
2. Run:

```bash
npm run dev
```

3. Wait for the server to start
4. You should see something like:
   ```
   VITE v5.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

### Step 5: Access the Admin Dashboard

1. **Open your browser**
2. **Navigate to**: `http://localhost:5173/admin`
3. **You should see**:
   - If not signed in: You'll be redirected to home page
   - If signed in but not admin: "Access Denied" message
   - If signed in as admin: Admin Dashboard!

### Step 6: Sign In as Admin

**If you're not signed in:**

1. Go to the home page: `http://localhost:5173`
2. Click **"Sign In"** (usually in navigation)
3. **Sign in with your admin credentials:**
   - **Email**: Your admin email
   - **Password**: Your admin password
   - OR use **Google Sign-In** if your admin account is Google-authenticated

4. After signing in, navigate to: `http://localhost:5173/admin`

### Step 7: Explore the Admin Dashboard

Once you're in, you'll see:

**Left Sidebar:**
- 📊 Dashboard
- 📦 Products
- 🛒 Orders
- 🔄 Returns
- 🏷️ Coupons
- 🖼️ Banners
- ⚙️ Settings

**Main Content Area:**
- **Dashboard** with 4 stats cards:
  - Products (Total products)
  - Orders (Total orders)
  - Returns (Return requests)
  - Coupons (Active coupons)

**Each card has a "Manage" link** to go to that section.

---

## 🔍 Troubleshooting

### Issue 1: "Access Denied" Message

**Problem**: You're signed in but see "Access Denied"

**Solution**:
1. Check if your user is in `admin_users` table:
   ```sql
   SELECT * FROM public.admin_users WHERE email = 'your-email@example.com';
   ```
2. If not found, add your user (see Step 2)
3. Clear browser cache and try again

### Issue 2: Redirected to Home Page

**Problem**: When accessing `/admin`, you're redirected to home

**Solution**:
1. Make sure you're signed in
2. Check browser console for errors
3. Verify admin user exists in database

### Issue 3: "Function is_admin does not exist"

**Problem**: Database error about missing function

**Solution**:
1. Run the admin_users migration:
   ```sql
   -- Run this from supabase/migrations/20250101000010_create_admin_users_table.sql
   ```
2. Or manually create the function (see migration file)

### Issue 4: Can't Sign In

**Problem**: Sign in not working

**Solution**:
1. Check if user exists in Supabase Auth
2. Verify email/password is correct
3. Try resetting password in Supabase Dashboard
4. Check if email confirmation is required

### Issue 5: Admin Panel Shows but No Data

**Problem**: Dashboard loads but shows "-" for all stats

**Solution**:
- This is normal! The dashboard shows placeholders until we add real statistics
- You can still navigate to Products, Orders, Returns, Coupons sections
- Those sections will show actual data from your database

---

## 📸 What You Should See

### Dashboard View:
```
┌─────────────────────────────────────────────┐
│  Admin Dashboard                             │
│  Manage your store                           │
├─────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐ │
│  │Products │ │ Orders  │ │ Returns │ │Coupons│ │
│  │   📦    │ │   🛒    │ │   🔄    │ │  🏷️  │ │
│  │    -    │ │    -    │ │    -    │ │  -   │ │
│  │[Manage] │ │[Manage] │ │[Manage] │ │[Manage]│ │
│  └─────────┘ └─────────┘ └─────────┘ └─────┘ │
└─────────────────────────────────────────────┘
```

### Sidebar:
```
┌─────────────────────┐
│ Admin Panel         │
│ Aurora Cadence      │
├─────────────────────┤
│ 📊 Dashboard        │ ← Active (highlighted)
│ 📦 Products         │
│ 🛒 Orders           │
│ 🔄 Returns          │
│ 🏷️ Coupons          │
│ 🖼️ Banners          │
│ ⚙️ Settings         │
├─────────────────────┤
│ [← Back to Site]    │
└─────────────────────┘
```

---

## ✅ Quick Test Checklist

Once you're in the admin dashboard:

- [ ] Can see the dashboard with 4 stats cards
- [ ] Can see the sidebar navigation
- [ ] Can click "Products" → See products list
- [ ] Can click "Orders" → See orders list
- [ ] Can click "Returns" → See returns list
- [ ] Can click "Coupons" → See coupons list
- [ ] Can click "Back to Site" → Returns to home page

---

## 🎯 Next Steps After Access

1. **Explore Products Section**
   - View all products
   - Test search functionality
   - Test filters

2. **Explore Orders Section**
   - View all orders
   - Click "View" on an order to see details
   - Test status updates

3. **Explore Returns Section**
   - View return requests
   - Test approve/reject functionality

4. **Explore Coupons Section**
   - View all coupons
   - Toggle active/inactive
   - Test filters

---

## 💡 Tips

1. **Bookmark the admin URL**: `http://localhost:5173/admin`
2. **Use the sidebar** to navigate between sections
3. **Stats show "-"** until we add real statistics (this is normal)
4. **All pages are protected** - only admins can access
5. **Check browser console** if you encounter any errors

---

## 🆘 Still Having Issues?

If you're still having trouble:

1. **Check browser console** (F12) for errors
2. **Check terminal** for server errors
3. **Verify database migrations** are applied
4. **Verify admin user** exists in `admin_users` table
5. **Try signing out and signing back in**

**Need more help?** Share:
- What step you're on
- Any error messages you see
- Screenshot of what you're seeing

---

**Ready to start?** Follow the steps above and you'll be in the admin dashboard in no time! 🚀



