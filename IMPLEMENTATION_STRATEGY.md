# Implementation Strategy for Cart, Wishlist & Addresses

## 🎯 Overview

Moving cart, wishlist, and addresses to database with smart sync between localStorage and database.

---

## 🔄 Sync Strategy

### Cart Sync Flow:

```
1. User adds item to cart:
   ├─ Add to localStorage (instant UI update)
   └─ If logged in → Sync to database (background)

2. User logs in:
   ├─ Load cart from database
   ├─ Load cart from localStorage
   ├─ Merge (database wins on conflicts)
   └─ Update both localStorage and database

3. User logs out:
   ├─ Keep localStorage (for guest browsing)
   └─ Database stays (for when they return)

4. User on different device:
   ├─ Logs in
   ├─ Loads cart from database
   └─ Cart appears on new device ✅
```

### Wishlist Sync Flow:
Same as cart

### Address Sync Flow:

```
1. User saves address:
   └─ Save to database only

2. User checks out:
   ├─ Load saved addresses from database
   ├─ Show saved addresses as options
   └─ Allow selecting saved or entering new

3. User logs in:
   └─ Load saved addresses from database
```

---

## 📋 Implementation Steps

### Step 1: Create Database Tables ✅
- Migration file created: `20250101000007_create_user_data_tables.sql`
- Tables: `cart_items`, `wishlist_items`, `user_addresses`

### Step 2: Update Cart Store
- Add database sync functions
- Sync on login/logout
- Sync on add/update/remove

### Step 3: Update Wishlist Store
- Add database sync functions
- Sync on login/logout
- Sync on add/remove

### Step 4: Create Address Store
- New store for managing addresses
- Load from database
- Save to database

### Step 5: Update Checkout
- Show saved addresses
- Allow selecting saved address
- Save new address option

### Step 6: Update Profile
- Show saved addresses
- Add/edit/delete addresses
- Set default address

---

## 💡 Key Features

### Smart Merging:
- If item in localStorage but not in database → Add to database
- If item in database but not in localStorage → Add to localStorage
- If item in both → Use database quantity (more recent)

### Offline Support:
- localStorage works offline
- Syncs to database when online + logged in

### Performance:
- localStorage for instant UI updates
- Database sync in background
- No blocking operations

---

## 🔒 Security

- RLS policies ensure users only see their own data
- All operations require authentication
- Guest users use localStorage only

---

## ✅ Benefits

1. **Cross-Device**: Cart/wishlist on all devices
2. **Persistent**: Never lose data
3. **Fast**: localStorage for instant updates
4. **Reliable**: Database for permanent storage
5. **User-Friendly**: Saved addresses for quick checkout

---

**This will provide a complete, professional e-commerce experience!**

