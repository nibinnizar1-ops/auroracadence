# Deferred Features

## Product Types & Categories Management (Deferred)

Due to organization security restrictions blocking Supabase API calls, the following features have been deferred:

### What's Deferred:
- Database tables: `product_types` and `categories_management`
- Settings page (`/admin/settings`) for managing product types and categories
- Full CRUD operations for types and categories

### Current Implementation:
- Product Form uses **static lists** for product types and categories
- Users can still add new types/categories temporarily (stored in component state only)
- These temporary additions are lost on page refresh
- All other features work normally:
  - ✅ Handle/Slug explanation
  - ✅ Simplified variant form
  - ✅ Coupon selection
  - ✅ Product discount fields

### Static Lists Currently Used:

**Product Types:**
- Necklace
- Earrings
- Ring
- Bracelet
- Anklet
- Brooch

**Categories:**
- Office Wear
- Daily Wear
- Party Wear
- Date Night
- Wedding Wear
- New Arrivals
- Bestseller
- Necklaces
- Rings
- Earrings
- Bracelets

### To Enable Later:

1. Apply migration: `20250113000012_create_product_types_and_categories_management.sql`
2. Uncomment Settings route in `src/App.tsx`
3. Uncomment Settings link in `src/components/admin/AdminLayout.tsx`
4. Update `src/pages/admin/ProductForm.tsx`:
   - Uncomment import: `import { getActiveProductTypes, getActiveCategories } from "@/lib/admin-settings";`
   - Replace static lists with database calls in `loadDropdowns()`
   - Restore `handleAddNewType()` and `handleAddNewCategory()` to use database

### Files Ready for Later:
- ✅ `src/lib/admin-settings.ts` - API functions ready
- ✅ `src/pages/admin/Settings.tsx` - Settings page ready
- ✅ Migration file created and ready to apply

