# Create Edge Functions - Step by Step Guide

## 🎯 You Need to Create the Functions First

Since you don't see existing functions, let's create them using the "Via Editor" option.

---

## Step 1: Create `create-razorpay-order` Function

### 1.1 Open the Editor
1. On the Edge Functions page, find the card that says **"Via Editor"** (first card with `<>` icon)
2. Click the **"Open Editor"** button

### 1.2 Name Your Function
1. You'll see a code editor
2. Look for a field to name your function (usually at the top or in a sidebar)
3. Enter: **`create-razorpay-order`**
   - Use lowercase
   - Use hyphens (not underscores)
   - Exactly: `create-razorpay-order`

### 1.3 Get the Code
1. Open this file in your code editor:
   - `supabase/functions/create-razorpay-order/index.ts`
2. Select ALL the code:
   - Press `Ctrl + A` (Windows) or `Cmd + A` (Mac)
3. Copy it:
   - Press `Ctrl + C` (Windows) or `Cmd + C` (Mac)

### 1.4 Paste the Code
1. In the Supabase editor, select all existing code (if any)
2. Delete it
3. Paste your copied code:
   - Press `Ctrl + V` (Windows) or `Cmd + V` (Mac)

### 1.5 Deploy
1. Look for a **"Deploy"** or **"Save"** button
   - Usually green or blue
   - Top right or bottom of editor
2. Click **"Deploy"**
3. Wait for success message (10-30 seconds)

---

## Step 2: Create `verify-razorpay-payment` Function

### 2.1 Create New Function
1. Go back to Edge Functions page
2. Click **"Deploy a new function"** (green button)
3. Click **"Via Editor"** → **"Open Editor"**

### 2.2 Name Your Function
1. Enter name: **`verify-razorpay-payment`**
   - Exactly: `verify-razorpay-payment`

### 2.3 Get the Code
1. Open this file:
   - `supabase/functions/verify-razorpay-payment/index.ts`
2. Select ALL (`Ctrl/Cmd + A`)
3. Copy (`Ctrl/Cmd + C`)

### 2.4 Paste and Deploy
1. Paste in Supabase editor (`Ctrl/Cmd + V`)
2. Click **"Deploy"**
3. Wait for success

---

## ✅ Verification

After creating both functions:

1. Go back to Edge Functions page
2. You should now see:
   - `create-razorpay-order`
   - `verify-razorpay-payment`
3. Both should show "Active" or "Deployed" status

---

## 📝 Quick Checklist

- [ ] Clicked "Via Editor" → "Open Editor"
- [ ] Named function: `create-razorpay-order`
- [ ] Pasted code from `supabase/functions/create-razorpay-order/index.ts`
- [ ] Clicked "Deploy"
- [ ] Function created successfully
- [ ] Created second function: `verify-razorpay-payment`
- [ ] Pasted code from `supabase/functions/verify-razorpay-payment/index.ts`
- [ ] Deployed second function
- [ ] Both functions visible in list

---

## 🎯 Let's Start!

**Right now, do this:**

1. Click on **"Via Editor"** card (first one with `<>` icon)
2. Click **"Open Editor"** button
3. Tell me what you see - I'll guide you through naming and pasting the code!

**Ready?** 🚀



