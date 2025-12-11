# Coupon/Discount Code System & Authentication Plan

---

## 🎟️ 1. COUPON/DISCOUNT CODE SYSTEM

### Database Schema

#### `coupons` Table
```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- "SUMMER20", "WELCOME10"
  name TEXT NOT NULL, -- "Summer Sale 20%"
  description TEXT,
  
  -- Discount Type
  discount_type TEXT NOT NULL, -- "percentage" or "fixed_amount"
  discount_value DECIMAL(10,2) NOT NULL, -- 20 (for 20%) or 100 (for ₹100 off)
  
  -- Validity
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  
  -- Usage Limits
  max_uses INTEGER, -- NULL = unlimited
  max_uses_per_user INTEGER DEFAULT 1, -- How many times one user can use
  
  -- Minimum Requirements
  minimum_order_amount DECIMAL(10,2), -- Minimum cart value to apply
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_paused BOOLEAN DEFAULT false, -- Pause without deleting
  
  -- Applicability
  applicable_to TEXT DEFAULT 'all', -- "all", "categories", "products", "collections"
  applicable_ids JSONB, -- Array of category/product/collection IDs if not "all"
  
  -- Metadata
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### `coupon_usage` Table (Track Usage)
```sql
CREATE TABLE coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID, -- Can be NULL for guest checkout
  used_at TIMESTAMP DEFAULT now(),
  
  -- Store discount applied at time of use
  discount_amount DECIMAL(10,2) NOT NULL,
  order_total_before_discount DECIMAL(10,2) NOT NULL,
  order_total_after_discount DECIMAL(10,2) NOT NULL
);
```

### Features

#### Admin Panel Features:
1. **Create Coupon**
   - Code (auto-generate or manual)
   - Discount type (percentage/fixed)
   - Validity dates
   - Usage limits
   - Minimum order amount
   - Applicable to (all/categories/products/collections)

2. **Manage Coupons**
   - ✅ Pause/Resume (without deleting)
   - ✅ Edit (with validation)
   - ✅ Delete
   - ✅ View usage statistics
   - ✅ See who used it

3. **Coupon Analytics**
   - Total uses
   - Total discount given
   - Revenue generated
   - Most used coupons

#### Frontend Features:
1. **Apply Coupon**
   - Input field in cart/checkout
   - Validate coupon
   - Show discount preview
   - Apply to order

2. **Coupon Validation**
   - Check if code exists
   - Check if active
   - Check if not expired
   - Check usage limits
   - Check minimum order amount
   - Check if user already used (if logged in)

### Implementation Flow

#### Checkout Flow:
```
1. User adds items to cart
2. User enters coupon code
3. Frontend validates coupon:
   - Check code exists
   - Check active & not paused
   - Check date validity
   - Check minimum order amount
   - Check usage limits
4. If valid, apply discount
5. Show updated total
6. On order completion, record usage
```

#### Backend API:
```typescript
// Validate coupon
POST /api/coupons/validate
Body: { code: "SUMMER20", cart_total: 5000 }
Response: { valid: true, discount: 1000, final_total: 4000 }

// Apply coupon to order
POST /api/orders/:id/apply-coupon
Body: { coupon_code: "SUMMER20" }
```

---

## 🔐 2. AUTHENTICATION OPTIONS & PRICING

### Supabase Auth Pricing Overview

#### ✅ **FREE Options:**

1. **Email + Password** - FREE
   - Traditional signup/login
   - No additional costs
   - Unlimited users

2. **Email OTP (One-Time Password)** - FREE
   - User enters email
   - Receives 6-digit code via email
   - Enters code to login
   - No password needed
   - **Completely FREE** ✅

3. **Magic Link** - FREE
   - User enters email
   - Receives link in email
   - Clicks link to login
   - **Completely FREE** ✅

4. **Google OAuth** - FREE
   - "Sign in with Google" button
   - No additional costs
   - **Completely FREE** ✅

5. **Other OAuth Providers** - FREE
   - GitHub, Apple, Facebook, etc.
   - All OAuth providers are FREE ✅

#### 💰 **PAID Options:**

1. **Phone OTP (SMS)** - Costs Money
   - Requires SMS provider (Twilio, MessageBird, etc.)
   - Cost: ~₹0.50 - ₹2 per SMS (depends on provider)
   - **NOT FREE** ❌

2. **Phone MFA (Multi-Factor Auth)** - $75/month
   - Advanced phone authentication
   - Only needed for high-security apps
   - **Expensive** ❌

### Recommendation: **Email OTP** (FREE) ✅

#### Why Email OTP?
- ✅ **100% FREE** - No costs
- ✅ **No password** - Better UX
- ✅ **Secure** - One-time codes
- ✅ **Easy to implement**
- ✅ **Works for all users** (everyone has email)

#### How Email OTP Works:
```
1. User enters email
2. Clicks "Send OTP"
3. Receives 6-digit code in email
4. Enters code
5. Logged in!
```

#### Implementation:
```typescript
// Send OTP
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com'
})

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456', // 6-digit code
  type: 'email'
})
```

### Alternative: **Google Auth** (Also FREE) ✅

#### Why Google Auth?
- ✅ **100% FREE**
- ✅ **One-click login** - Super fast
- ✅ **No password** - Users trust Google
- ✅ **Auto-fills user info** (name, email, profile pic)

#### Implementation:
```typescript
// Sign in with Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback'
  }
})
```

### Best Approach: **Both Email OTP + Google Auth** ✅

#### Why Both?
- **Email OTP**: For users without Google account
- **Google Auth**: For users who prefer quick login
- **Both FREE** ✅
- **Better user experience**

---

## 📊 Cost Comparison

| Method | Cost | Setup Difficulty | User Experience |
|--------|------|------------------|-----------------|
| **Email OTP** | FREE ✅ | Easy | Good |
| **Google Auth** | FREE ✅ | Easy | Excellent |
| **Email + Password** | FREE ✅ | Easy | Standard |
| **Phone OTP** | ₹0.50-2/SMS ❌ | Medium | Good |
| **Phone MFA** | $75/month ❌ | Hard | Excellent |

---

## 🎯 Recommended Authentication Setup

### Phase 1: Start with Email OTP (FREE)
- Implement email OTP first
- Simple and free
- Works for everyone

### Phase 2: Add Google Auth (FREE)
- Add "Sign in with Google" button
- Improves UX
- Still free

### Phase 3: Add Phone OTP (If Needed)
- Only if you really need it
- Costs money per SMS
- Consider if users request it

---

## 🔧 Implementation Plan

### 1. Update Auth Store
Replace mock auth with Supabase Auth:
- Email OTP flow
- Google OAuth flow
- Session management

### 2. Update Login/Signup Dialogs
- Add OTP input field
- Add "Send OTP" button
- Add "Sign in with Google" button
- Remove password field (if using OTP only)

### 3. Add Auth Callback Page
- Handle Google OAuth redirect
- Verify OTP codes

---

## 💡 Final Recommendation

### Authentication:
✅ **Start with Email OTP** (FREE)
✅ **Add Google Auth** (FREE)
❌ **Skip Phone OTP** (unless absolutely needed)

### Coupon System:
✅ **Implement full coupon system**
- Create, pause, update coupons
- Track usage
- Apply at checkout

---

## ❓ Questions for You

1. **Authentication Preference:**
   - Email OTP only?
   - Google Auth only?
   - Both Email OTP + Google Auth? (Recommended)

2. **Coupon System:**
   - Start with basic coupons?
   - Or full featured from day 1?

3. **Ready to implement?**
   - I can start with Email OTP + Coupon system
   - Then add Google Auth later

---

**Let me know your preferences and I'll start implementing!** 🚀

