# User Data Persistence Analysis

## Current Situation Analysis

Let me break down what will and won't persist when a user logs out and comes back:

---

## ✅ What WILL Persist (Currently Working)

### 1. **Orders** ✅ (Partially)
- **Stored in**: `orders` table in database
- **Persists**: ✅ Yes, across all devices/browsers
- **Issue**: ⚠️ `user_id` is NOT being set when creating orders
- **Address**: ✅ Stored in `shipping_address` and `billing_address` fields
- **What user sees**: They can see their orders IF we query by email or user_id

### 2. **Basic Profile Info** ✅
- **Stored in**: `auth.users` (Supabase Auth)
- **Persists**: ✅ Yes, name, email, avatar from Google
- **What user sees**: ✅ Name, email, avatar will be there

---

## ❌ What WON'T Persist (Current Issues)

### 1. **Cart Items** ❌
- **Stored in**: localStorage (browser only)
- **Persists**: ❌ NO - Only in same browser
- **Problem**: 
  - If user uses different device → Cart is empty
  - If user clears browser data → Cart is lost
  - Not tied to user account

### 2. **Wishlist** ❌
- **Stored in**: localStorage (browser only)
- **Persists**: ❌ NO - Only in same browser
- **Problem**: 
  - If user uses different device → Wishlist is empty
  - If user clears browser data → Wishlist is lost
  - Not tied to user account

### 3. **Saved Addresses** ❌
- **Stored in**: Only in orders (not reusable)
- **Persists**: ❌ NO - User has to re-enter address each time
- **Problem**: No saved addresses for quick checkout

---

## 🔧 What Needs to Be Fixed

### Issue 1: Orders Not Linked to User
**Problem**: When creating orders, `user_id` is not being set.

**Current Code** (in checkout):
```typescript
// user_id is NOT being set!
await supabase.from('orders').insert({
  customer_email: formData.email,
  // ... but no user_id
})
```

**Fix Needed**: Set `user_id` when user is logged in.

### Issue 2: Cart Not Synced to Database
**Problem**: Cart is only in localStorage, not in database.

**Fix Needed**: Create `cart_items` table and sync to database.

### Issue 3: Wishlist Not Synced to Database
**Problem**: Wishlist is only in localStorage, not in database.

**Fix Needed**: Create `wishlist_items` table and sync to database.

### Issue 4: No Saved Addresses
**Problem**: Addresses are only stored in orders, not reusable.

**Fix Needed**: Create `user_addresses` table.

---

## ✅ Summary: What User Will See

### When User Logs Back In:

1. **Orders**: ✅ YES (if we fix user_id linking)
   - They can see their order history
   - Order details, addresses, items

2. **Cart**: ❌ NO
   - Cart will be empty (unless same browser + localStorage intact)

3. **Wishlist**: ❌ NO
   - Wishlist will be empty (unless same browser + localStorage intact)

4. **Address**: ❌ NO
   - Have to re-enter address each time

5. **Profile**: ✅ YES
   - Name, email, avatar from Google

---

## 🎯 Recommendation

To make everything persist properly, we need to:

1. ✅ **Fix order creation** - Set `user_id` when user is logged in
2. ✅ **Create cart_items table** - Store cart in database
3. ✅ **Create wishlist_items table** - Store wishlist in database
4. ✅ **Create user_addresses table** - Save addresses for reuse

**Would you like me to create these fixes?**

