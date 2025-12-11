# Complete User Data Persistence Plan

## 🎯 Goal
Move Cart, Wishlist, and Addresses to database so they persist across all devices and sessions.

---

## 📊 Database Tables Needed

### 1. **cart_items** Table
- Store cart items per user
- Link to products/variants
- Sync with localStorage for offline support

### 2. **wishlist_items** Table
- Store wishlist items per user
- Link to products
- Sync with localStorage

### 3. **user_addresses** Table
- Store saved addresses per user
- Mark default address
- Use in checkout

---

## 🔄 How It Will Work

### When User Signs In:
1. ✅ Load cart from database → Sync to localStorage
2. ✅ Load wishlist from database → Sync to localStorage
3. ✅ Load saved addresses → Show in checkout

### When User Adds to Cart:
1. ✅ Add to localStorage (immediate)
2. ✅ Sync to database (if logged in)

### When User Logs Out:
1. ✅ Keep localStorage (for guest browsing)
2. ✅ Database data stays (for when they return)

### When User Logs Back In:
1. ✅ Merge localStorage + database cart
2. ✅ Merge localStorage + database wishlist
3. ✅ Show saved addresses

---

## ✅ Benefits

1. **Cross-Device Sync**: Cart/wishlist available on all devices
2. **Persistent Data**: Never lose cart/wishlist
3. **Saved Addresses**: Quick checkout with saved addresses
4. **Better UX**: Seamless experience across sessions

---

## 🎯 Implementation Plan

### Phase 1: Create Database Tables
- Create `cart_items` table
- Create `wishlist_items` table
- Create `user_addresses` table

### Phase 2: Update Stores
- Update `cartStore` to sync with database
- Update `wishlistStore` to sync with database
- Create `addressStore` for saved addresses

### Phase 3: Update UI
- Update checkout to use saved addresses
- Add address management in profile
- Sync on login/logout

---

## 💡 Smart Sync Strategy

### Cart Sync Logic:
```
User adds item:
  → Add to localStorage (instant)
  → If logged in: Sync to database (background)

User logs in:
  → Load from database
  → Merge with localStorage (prefer database if conflict)
  → Update both

User logs out:
  → Keep localStorage (guest mode)
  → Database stays (for return)
```

### Wishlist Sync Logic:
Same as cart

### Address Sync:
```
User saves address:
  → Save to database
  → Mark as default if first address

User checks out:
  → Show saved addresses
  → Allow selecting saved or entering new
```

---

## 🔒 Security (RLS Policies)

- Users can only see/edit their own cart items
- Users can only see/edit their own wishlist items
- Users can only see/edit their own addresses

---

## 📋 Tables Structure

### cart_items
- id, user_id, product_id, variant_id, quantity, created_at, updated_at

### wishlist_items
- id, user_id, product_id, created_at

### user_addresses
- id, user_id, label (Home/Work/etc), address, city, state, pincode, phone, is_default, created_at

---

**Ready to implement? This will give users a complete, persistent shopping experience!**

