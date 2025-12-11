# How to Apply Database Migrations

I've created all the required database tables for your Aurora Cadence e-commerce platform. Here's how to apply them:

## 📋 Created Migration Files

1. **`20250101000001_create_coupons_tables.sql`** - Coupons and coupon usage tracking
2. **`20250101000002_create_products_tables.sql`** - Products, variants, images, and options
3. **`20250101000003_create_collections_tables.sql`** - Collections and collection-products relationships
4. **`20250101000004_create_categories_tables.sql`** - Categories and category-products relationships
5. **`20250101000005_create_order_line_items.sql`** - Order line items and order enhancements

## 🚀 Method 1: Apply via Supabase Dashboard (Recommended)

### Step 1: Open Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: `rpfvnjaggkhmucosijji`

### Step 2: Go to SQL Editor
1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**

### Step 3: Apply Each Migration
1. Open each migration file from `supabase/migrations/`
2. Copy the entire SQL content
3. Paste it into the SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)
5. Wait for success message
6. Repeat for each migration file **in order**

### Migration Order:
1. ✅ `20250101000001_create_coupons_tables.sql`
2. ✅ `20250101000002_create_products_tables.sql`
3. ✅ `20250101000003_create_collections_tables.sql`
4. ✅ `20250101000004_create_categories_tables.sql`
5. ✅ `20250101000005_create_order_line_items.sql`

## 🚀 Method 2: Apply via Supabase CLI

If you have Supabase CLI installed:

```bash
# Make sure you're in the project directory
cd "/Users/nibin.nizar/Aurora main/auroracadence"

# Link to your Supabase project (if not already linked)
supabase link --project-ref rpfvnjaggkhmucosijji

# Apply all migrations
supabase db push
```

## 📊 What Tables Were Created

### Coupon System
- ✅ `coupons` - Store discount codes
- ✅ `coupon_usage` - Track coupon usage per order/user

### Product System
- ✅ `products` - Main product information
- ✅ `product_variants` - Product variants (size, material, etc.)
- ✅ `product_images` - Product images
- ✅ `product_options` - Variant option combinations

### Collections & Categories
- ✅ `collections` - Product collections
- ✅ `collection_products` - Many-to-many: collections ↔ products
- ✅ `categories` - Product categories
- ✅ `category_products` - Many-to-many: categories ↔ products

### Order Enhancements
- ✅ `order_line_items` - Detailed order items linked to products/variants
- ✅ Updated `orders` table with:
  - `coupon_id` - Link to applied coupon
  - `discount_amount` - Discount amount applied
  - `user_id` - Link to authenticated user

## ✅ Verification

After applying migrations, verify in Supabase Dashboard:

1. Go to **"Table Editor"**
2. You should see all the new tables:
   - coupons
   - coupon_usage
   - products
   - product_variants
   - product_images
   - product_options
   - collections
   - collection_products
   - categories
   - category_products
   - order_line_items

3. Check that `orders` table has new columns:
   - coupon_id
   - discount_amount
   - user_id

## 🔒 Security (RLS Policies)

All tables have Row Level Security (RLS) enabled with appropriate policies:

- **Public tables** (products, collections, categories): Anyone can read active items
- **User data** (orders, coupon_usage): Users can only view their own data
- **Admin operations**: Will need additional policies for admin write access

## 🎯 Next Steps

After applying migrations:

1. ✅ Verify all tables exist
2. ✅ Test creating a product
3. ✅ Test creating a coupon
4. ✅ Test order creation with line items
5. ✅ Set up admin RLS policies (if needed)

---

**All migration files are ready in `supabase/migrations/` directory!**

