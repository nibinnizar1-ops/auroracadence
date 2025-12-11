# Implementation Plan - Custom E-Commerce Platform

## 📋 Requirements Summary

### 1. **Image Storage & Banner Management**

#### Supabase Storage Setup
- **Bucket**: `product-images` - For product photos
- **Bucket**: `banners` - For website banners
- **Bucket**: `media` - For other marketing assets (optional)

#### Banner Management System
**Database Table: `banners`**
```sql
- id (UUID, primary key)
- name (TEXT) - e.g., "Hero Banner 1", "Luxury Collection Banner"
- section (TEXT) - "hero", "category-showcase", "luxury", "offer", etc.
- image_url (TEXT) - Supabase Storage URL
- alt_text (TEXT)
- link_url (TEXT, nullable) - Where banner should link to
- is_active (BOOLEAN) - Show/hide banner
- position (INTEGER) - Display order
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Admin Features:**
- Upload banner images
- Assign to specific sections (Hero, Category Showcase, Luxury, Offer, etc.)
- Set active/inactive
- Add link URL
- Reorder banners

**Frontend Implementation:**
- Fetch banners by section from database
- Display dynamically based on active banners
- Easy to swap banners without code changes

---

### 2. **Admin Panel Architecture**

#### Option 1: Subdomain (Recommended) ✅
- **URL**: `admin.auroracadence.com` or `admin.yourdomain.com`
- **Pros**: 
  - Complete separation
  - Different authentication
  - Can use different tech stack if needed
  - Better security isolation
- **Cons**: 
  - Need to configure subdomain
  - CORS setup required

#### Option 2: Separate Route (Alternative)
- **URL**: `yourdomain.com/admin`
- **Pros**: 
  - Easier setup
  - Same domain, no CORS
- **Cons**: 
  - Less separation
  - Need route protection

#### Option 3: Separate App (Most Flexible)
- **URL**: `admin.auroracadence.com`
- **Tech**: Can be separate React/Vue app
- **Pros**: 
  - Complete independence
  - Can optimize separately
- **Cons**: 
  - More maintenance

**Recommendation: Subdomain with same codebase**
- Create `/admin` routes in main app
- Use middleware to protect admin routes
- Can deploy to subdomain later if needed

---

### 3. **Product Variants & Tags System**

#### Variant Options
1. **Size** - Small, Medium, Large, etc.
2. **Color** - Gold, Rose Gold, Silver, etc.
3. **Material** - 18K Gold, 22K Gold, Sterling Silver, etc.
4. **Type** - Necklace, Anklet, Ring, Earring, Bracelet, etc.

#### Tags System (Best Seller, New Arrivals, etc.)

**Database Table: `product_tags`**
```sql
- id (UUID, primary key)
- name (TEXT, unique) - "best-seller", "new-arrival", "trending", "limited-edition"
- display_name (TEXT) - "Best Seller", "New Arrival"
- color (TEXT) - For badge color
- created_at (TIMESTAMP)
```

**Junction Table: `product_tag_assignments`**
```sql
- product_id (UUID, foreign key -> products)
- tag_id (UUID, foreign key -> product_tags)
- created_at (TIMESTAMP)
```

**Flow:**
1. Admin creates tags (Best Seller, New Arrival, etc.)
2. While adding/editing product, admin can select multiple tags
3. Frontend fetches products by tag
4. Display products under respective tag sections

**Frontend Implementation:**
- Homepage sections: "Best Sellers", "New Arrivals"
- Filter products by tags
- Show tag badges on product cards

---

### 4. **Order Status Management**

**Current `orders` table already has `status` field**

**Order Status Flow:**
```
pending → confirmed → processing → shipped → delivered → cancelled
```

**Admin Features:**
- View all orders
- Update order status
- Add tracking number
- Add notes/comments
- Mark as shipped/delivered
- Cancel orders

**Database Enhancement:**
```sql
-- Add to orders table
- tracking_number (TEXT, nullable)
- shipped_at (TIMESTAMP, nullable)
- delivered_at (TIMESTAMP, nullable)
- status_notes (TEXT, nullable)
```

**Status Options:**
- `pending` - Order placed, payment pending
- `confirmed` - Payment received
- `processing` - Being prepared
- `shipped` - Out for delivery
- `delivered` - Delivered to customer
- `cancelled` - Order cancelled
- `refunded` - Refund processed

---

### 5. **Currency & Discount System**

#### Currency Management
**Database Table: `currencies`**
```sql
- id (UUID, primary key)
- code (TEXT, unique) - "INR", "USD", "EUR"
- symbol (TEXT) - "₹", "$", "€"
- name (TEXT) - "Indian Rupee"
- exchange_rate (DECIMAL) - Relative to base currency
- is_active (BOOLEAN)
- is_default (BOOLEAN)
```

**Product Pricing:**
- Store base price in product variants
- Calculate other currencies using exchange rate
- Allow admin to set custom prices per currency (optional)

#### Discount System (Integrated in Product Page)

**Option 1: Simple Discount (Recommended)**
- Add fields to product variants:
  ```sql
  - price (DECIMAL) - Regular price
  - compare_at_price (DECIMAL) - Original price (for showing discount)
  - discount_percentage (INTEGER) - Auto-calculated
  ```

**Option 2: Advanced Discount Rules**
- Separate discount table for complex rules
- For now, Option 1 is simpler and sufficient

**Admin UI:**
- When adding product, admin can:
  - Set regular price
  - Set sale price (compare_at_price)
  - System auto-calculates discount percentage
  - Show "Sale" badge if compare_at_price > price

**Frontend:**
- Show original price (strikethrough)
- Show sale price (highlighted)
- Display discount percentage badge

---

### 6. **Search System Explained**

#### Option 1: PostgreSQL Full-Text Search (Recommended for Start)
**How it works:**
- PostgreSQL has built-in full-text search
- Index product titles, descriptions
- Fast and free
- Good for small to medium catalogs (< 10,000 products)

**Implementation:**
```sql
-- Create search index
CREATE INDEX product_search_idx ON products 
USING gin(to_tsvector('english', title || ' ' || description));

-- Search query
SELECT * FROM products 
WHERE to_tsvector('english', title || ' ' || description) 
@@ plainto_tsquery('english', 'gold necklace');
```

**Pros:**
- ✅ Free
- ✅ No external service
- ✅ Good enough for jewelry store
- ✅ Integrated with database

**Cons:**
- ❌ Not as powerful as dedicated search
- ❌ Limited typo tolerance
- ❌ No analytics

#### Option 2: Algolia (Premium Search)
**How it works:**
- External search service
- Very fast, typo-tolerant
- Great analytics
- Costs money (free tier available)

**When to use:**
- Large catalog (10,000+ products)
- Need advanced search features
- Want search analytics

#### Option 3: Typesense (Open Source Alternative)
**How it works:**
- Self-hosted search engine
- Similar to Algolia
- Free and open source

**Recommendation:**
- **Start with PostgreSQL Full-Text Search**
- Can upgrade to Algolia/Typesense later if needed
- For jewelry store, PostgreSQL search is sufficient

---

### 7. **Start Fresh** ✅
- No migration needed
- Clean database setup
- New product structure

---

### 8. **Categories vs Collections - Explained**

#### Categories (Occasion-Based)
**Purpose:** Filter products by when/where to wear
- Daily Wear
- Office Wear
- Party Wear
- Date Night
- Wedding Wear

**Characteristics:**
- Products can belong to multiple categories
- Used for navigation/filtering
- More functional/practical

#### Collections (Curated Sets)
**Purpose:** Group products by theme/style
- "Luxury Collection"
- "Minimalist Collection"
- "Vintage Collection"
- "Summer Collection"

**Characteristics:**
- Marketing/curation tool
- Seasonal or themed
- Products can be in multiple collections

#### Recommendation: **Keep Both**
- **Categories** = Functional filtering (occasion-based)
- **Collections** = Marketing/curation (themed groups)
- A product can be in "Daily Wear" category AND "Luxury Collection"

**Simplified Alternative:**
- If you want simpler, use **Categories only**
- Add a "featured" or "collection" tag to categories
- Less complexity, easier to manage

**Your Choice:**
- Do you want both Categories AND Collections?
- Or just Categories with tags for special groupings?

---

## 🗄️ Complete Database Schema

### Core Tables

#### 1. `products`
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  handle TEXT UNIQUE NOT NULL,
  product_type TEXT, -- Necklace, Anklet, etc.
  status TEXT DEFAULT 'draft', -- active, draft, archived
  featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 2. `product_variants`
```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  title TEXT, -- "Gold / Small"
  sku TEXT UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2), -- For discounts
  currency_code TEXT DEFAULT 'INR',
  inventory_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 3. `product_images`
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  url TEXT NOT NULL, -- Supabase Storage URL
  alt_text TEXT,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 4. `variant_options`
```sql
CREATE TABLE variant_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Size", "Color", "Material", "Type"
  value TEXT NOT NULL, -- "Small", "Gold", "18K", "Necklace"
  created_at TIMESTAMP DEFAULT now()
);
```

#### 5. `product_tags`
```sql
CREATE TABLE product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- "best-seller"
  display_name TEXT NOT NULL, -- "Best Seller"
  color TEXT, -- For badge color
  created_at TIMESTAMP DEFAULT now()
);
```

#### 6. `product_tag_assignments`
```sql
CREATE TABLE product_tag_assignments (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES product_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (product_id, tag_id)
);
```

#### 7. `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Daily Wear"
  handle TEXT UNIQUE NOT NULL, -- "daily-wear"
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 8. `category_products`
```sql
CREATE TABLE category_products (
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (category_id, product_id)
);
```

#### 9. `collections` (Optional)
```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 10. `collection_products` (Optional)
```sql
CREATE TABLE collection_products (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);
```

#### 11. `banners`
```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section TEXT NOT NULL, -- "hero", "luxury", "offer", etc.
  image_url TEXT NOT NULL,
  alt_text TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

#### 12. `currencies`
```sql
CREATE TABLE currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- "INR"
  symbol TEXT NOT NULL, -- "₹"
  name TEXT NOT NULL, -- "Indian Rupee"
  exchange_rate DECIMAL(10,4) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 13. `order_line_items` (Enhancement to existing orders)
```sql
CREATE TABLE order_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL, -- Price at time of purchase
  title TEXT NOT NULL, -- Product title at time of purchase
  variant_title TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

#### 14. Update `orders` table
```sql
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS status_notes TEXT;
```

---

## 🚀 Implementation Phases

### Phase 1: Database & Storage Setup
1. Create all database tables
2. Set up Supabase Storage buckets
3. Create RLS policies
4. Create indexes

### Phase 2: Product API (Backend)
1. Create Edge Functions for products
2. Implement CRUD operations
3. Implement search
4. Implement filtering by category/tag

### Phase 3: Banner Management
1. Create banner API
2. Admin UI for banner management
3. Frontend integration

### Phase 4: Frontend Migration
1. Replace Shopify calls
2. Update product components
3. Implement tag-based sections
4. Currency switcher

### Phase 5: Admin Panel
1. Product management
2. Order management
3. Banner management
4. Tag management

---

## ✅ Next Steps

1. **Confirm your choices:**
   - Categories only, or Categories + Collections?
   - Subdomain admin or /admin route?

2. **Start with Phase 1:**
   - Create database migrations
   - Set up storage buckets

3. **Then we'll build:**
   - Product API
   - Admin panel
   - Frontend updates

**Ready to start? Let me know your final decisions and we'll begin implementation!**

