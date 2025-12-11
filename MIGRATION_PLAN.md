# E-Commerce Platform Migration Plan
## Moving from Shopify to Custom Solution

---

## 🎯 Overview

This document outlines the requirements and plan for building a custom e-commerce platform without Shopify integration.

---

## 📋 Core Requirements Discussion

### 1. **Database Schema** (Supabase PostgreSQL)

#### Products Table
```sql
- id (UUID, primary key)
- title (TEXT)
- description (TEXT)
- handle (TEXT, unique, slug)
- product_type (TEXT) - e.g., "Ring", "Necklace", "Earring"
- status (TEXT) - "active", "draft", "archived"
- featured (BOOLEAN) - for homepage
- category (TEXT) - "daily-wear", "office-wear", "party-wear", etc.
- tags (TEXT[]) - array of tags
- meta_title (TEXT) - for SEO
- meta_description (TEXT) - for SEO
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Product Variants Table
```sql
- id (UUID, primary key)
- product_id (UUID, foreign key -> products)
- title (TEXT) - e.g., "Gold / Small"
- sku (TEXT, unique)
- price (DECIMAL 10,2)
- compare_at_price (DECIMAL 10,2) - for sale prices
- cost (DECIMAL 10,2) - internal cost
- currency_code (TEXT) - "INR"
- inventory_quantity (INTEGER)
- inventory_policy (TEXT) - "deny" or "continue"
- weight (DECIMAL) - for shipping
- position (INTEGER) - display order
- available (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Product Images Table
```sql
- id (UUID, primary key)
- product_id (UUID, foreign key -> products)
- variant_id (UUID, nullable, foreign key -> variants)
- url (TEXT) - Supabase Storage URL
- alt_text (TEXT)
- position (INTEGER) - display order
- created_at (TIMESTAMP)
```

#### Product Options Table (for variant combinations)
```sql
- id (UUID, primary key)
- variant_id (UUID, foreign key -> variants)
- name (TEXT) - e.g., "Size", "Material", "Color"
- value (TEXT) - e.g., "Small", "Gold", "Rose Gold"
```

#### Collections Table
```sql
- id (UUID, primary key)
- title (TEXT)
- handle (TEXT, unique)
- description (TEXT)
- image_url (TEXT)
- featured (BOOLEAN)
- created_at (TIMESTAMP)
```

#### Collection Products (Many-to-Many)
```sql
- collection_id (UUID, foreign key -> collections)
- product_id (UUID, foreign key -> products)
- position (INTEGER)
```

#### Categories Table (for occasion-based filtering)
```sql
- id (UUID, primary key)
- name (TEXT) - "Daily Wear", "Office Wear", etc.
- handle (TEXT, unique)
- description (TEXT)
- image_url (TEXT)
```

#### Category Products (Many-to-Many)
```sql
- category_id (UUID, foreign key -> categories)
- product_id (UUID, foreign key -> products)
```

---

### 2. **Storage Requirements**

#### Image Storage (Supabase Storage)
- **Bucket**: `product-images`
- **Structure**:
  - `/products/{product_id}/main.jpg`
  - `/products/{product_id}/variant-{variant_id}.jpg`
  - `/products/{product_id}/gallery/{image_id}.jpg`
- **Image Processing**: 
  - Thumbnails (300x300)
  - Medium (800x800)
  - Large (1200x1200)
  - Original size

#### File Upload Requirements
- Support multiple image formats (JPG, PNG, WebP)
- Image optimization/compression
- CDN delivery via Supabase Storage

---

### 3. **Backend API Requirements**

#### Product APIs (Supabase Edge Functions or REST API)

**GET /api/products**
- Query params: `limit`, `offset`, `category`, `collection`, `search`, `min_price`, `max_price`, `sort`
- Returns: Paginated product list

**GET /api/products/:handle**
- Returns: Single product with variants, images, options

**GET /api/products/search**
- Query params: `q` (search query)
- Returns: Search results

**GET /api/collections**
- Returns: All collections

**GET /api/collections/:handle**
- Returns: Collection with products

**GET /api/categories**
- Returns: All categories

**POST /api/products** (Admin only)
- Create new product

**PUT /api/products/:id** (Admin only)
- Update product

**DELETE /api/products/:id** (Admin only)
- Delete/archive product

---

### 4. **Admin Panel Requirements**

#### Product Management
- ✅ Create/Edit/Delete products
- ✅ Upload multiple images
- ✅ Manage variants (sizes, materials, colors)
- ✅ Set pricing
- ✅ Inventory management
- ✅ Product status (active/draft/archived)
- ✅ Bulk operations

#### Category & Collection Management
- ✅ Create/Edit categories
- ✅ Create/Edit collections
- ✅ Assign products to categories/collections

#### Order Management
- ✅ View all orders
- ✅ Order status updates
- ✅ Order details
- ✅ Customer information
- ✅ Export orders

#### Dashboard
- ✅ Sales analytics
- ✅ Order statistics
- ✅ Inventory alerts
- ✅ Recent orders

---

### 5. **Frontend Changes Required**

#### Files to Update:
1. **`src/lib/shopify.ts`** → Replace with `src/lib/products.ts`
   - `getProducts()` → Fetch from Supabase
   - `getProductByHandle()` → Fetch from Supabase
   - Remove `createStorefrontCheckout()` (not needed)

2. **`src/stores/cartStore.ts`**
   - Remove Shopify checkout creation
   - Keep local cart management

3. **`src/components/ProductGrid.tsx`**
   - Update to use new product API

4. **`src/components/FilteredProductGrid.tsx`**
   - Update filtering logic

5. **`src/pages/ProductDetail.tsx`**
   - Update product fetching

6. **All category pages** (DailyWear, OfficeWear, etc.)
   - Update to filter by category

---

### 6. **Authentication & Authorization**

#### User Roles
- **Customer**: Browse, purchase, view orders
- **Admin**: Full access to admin panel
- **Staff**: Limited admin access (optional)

#### Supabase Auth Integration
- Replace mock auth with Supabase Auth
- Email/Password or Phone-based auth
- Role-based access control (RLS policies)

---

### 7. **Inventory Management**

#### Features Needed:
- ✅ Track inventory per variant
- ✅ Low stock alerts
- ✅ Out of stock handling
- ✅ Inventory history/audit log
- ✅ Automatic status updates (available/unavailable)

---

### 8. **Order Management Enhancements**

#### Current Orders Table (Already exists)
- ✅ Basic order structure
- ⚠️ Need to link to products/variants properly
- ⚠️ Need order line items table

#### Order Line Items Table
```sql
- id (UUID, primary key)
- order_id (UUID, foreign key -> orders)
- product_id (UUID, foreign key -> products)
- variant_id (UUID, foreign key -> variants)
- quantity (INTEGER)
- price (DECIMAL 10,2) - price at time of purchase
- title (TEXT) - product title at time of purchase
- variant_title (TEXT)
- created_at (TIMESTAMP)
```

---

### 9. **Additional Features to Consider**

#### SEO
- ✅ Product meta tags
- ✅ Sitemap generation
- ✅ Structured data (JSON-LD)

#### Search & Filtering
- ✅ Full-text search
- ✅ Filter by price range
- ✅ Filter by category
- ✅ Filter by tags
- ✅ Sort options (price, date, popularity)

#### Performance
- ✅ Image optimization
- ✅ Caching strategy
- ✅ Pagination
- ✅ Lazy loading

#### Analytics
- ✅ Product views
- ✅ Add to cart events
- ✅ Purchase tracking
- ✅ Popular products

---

## 🚀 Implementation Phases

### Phase 1: Database Setup
1. Create all database tables
2. Set up RLS policies
3. Create indexes for performance
4. Set up Supabase Storage buckets

### Phase 2: Product API
1. Create Edge Functions for product CRUD
2. Implement product fetching
3. Implement search functionality
4. Implement filtering

### Phase 3: Frontend Migration
1. Replace Shopify API calls
2. Update product components
3. Update cart functionality
4. Test all product pages

### Phase 4: Admin Panel
1. Create admin dashboard
2. Product management UI
3. Order management UI
4. Image upload functionality

### Phase 5: Testing & Optimization
1. Test all flows
2. Performance optimization
3. Bug fixes
4. SEO optimization

---

## ❓ Questions to Discuss

1. **Image Storage**: 
   - Use Supabase Storage or external CDN (Cloudinary, AWS S3)?
   - Image optimization requirements?

2. **Admin Panel**:
   - Separate admin app or integrated in main app?
   - Preferred UI framework for admin?

3. **Inventory**:
   - Real-time inventory tracking?
   - Backorder support?

4. **Pricing**:
   - Multiple currencies?
   - Discount/promotion system?
   - Sale prices?

5. **Product Variants**:
   - How many variant options? (Size, Material, Color, etc.)
   - Variant combinations limit?

6. **Categories vs Collections**:
   - Keep both or merge?
   - Hierarchical categories?

7. **Search**:
   - Full-text search or simple filtering?
   - Search provider (PostgreSQL, Algolia, Typesense)?

8. **Migration**:
   - Migrate existing Shopify products?
   - Or start fresh?

---

## 📝 Next Steps

1. **Review this plan together**
2. **Answer the questions above**
3. **Prioritize features**
4. **Start with Phase 1 (Database Setup)**

---

**Ready to discuss and customize this plan based on your specific needs!**

