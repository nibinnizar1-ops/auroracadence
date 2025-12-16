# Complete Media Management System Plan

## Overview

This plan makes ALL media sections on the website manageable from the admin panel, including:
- Hero Carousel ✅ (Already done)
- Collection Banner ✅ (Already done)
- Luxury Banner ✅ (Already done)
- Category Showcase ("EVERYDAY LUXURY JEWELLERY")
- Category Section ("LUXURY MOODS")
- Gift Guide ("Timeless Gifts For Every Relationship")
- Influencer Showcase ("Worn by Women. Who Inspire Us.")
- Store Locations ("Try Love. Take Home.")
- Social Media Links (Footer)

---

## Database Schema

### 1. Category Showcase Items
**Table**: `category_showcase_items`
```sql
CREATE TABLE category_showcase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "New Arrivals", "Bestseller", etc.
  image_url TEXT NOT NULL,
  href TEXT NOT NULL, -- Link URL
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 2. Luxury Moods Categories
**Table**: `luxury_mood_categories`
```sql
CREATE TABLE luxury_mood_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Office Wear", "Daily Wear", etc.
  description TEXT, -- "Professional & Elegant"
  image_url TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 3. Gift Guide Items
**Table**: `gift_guide_items`
```sql
CREATE TABLE gift_guide_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "WIFE", "GIRLFRIEND", etc.
  label TEXT NOT NULL, -- "Gifts for"
  image_url TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 4. Influencer Showcase
**Table**: `influencer_showcase_items`
```sql
CREATE TABLE influencer_showcase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Aparna Thomas"
  quote TEXT NOT NULL,
  product_name TEXT NOT NULL, -- "Aurora 18k Gold Layered Necklace"
  product_description TEXT,
  image_url TEXT NOT NULL,
  instagram_reel_url TEXT,
  product_price DECIMAL(10,2),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 5. Store Locations
**Table**: `store_locations`
```sql
CREATE TABLE store_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "He & She"
  location TEXT NOT NULL, -- "Madannada, Kollam"
  description TEXT,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 6. Social Media Links
**Table**: `social_media_links`
```sql
CREATE TABLE social_media_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE, -- "instagram", "facebook", "twitter", "youtube"
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL, -- "Instagram", "Facebook", etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## Admin Pages to Create

### 1. Category Showcase Management
- **Route**: `/admin/category-showcase`
- **Features**: List, add, edit, delete, reorder items
- **Fields**: Name, Image, Link URL, Position, Active

### 2. Luxury Moods Management
- **Route**: `/admin/luxury-moods`
- **Features**: List, add, edit, delete, reorder categories
- **Fields**: Name, Description, Image, Link URL, Position, Active

### 3. Gift Guide Management
- **Route**: `/admin/gift-guide`
- **Features**: List, add, edit, delete, reorder items
- **Fields**: Name, Label, Image, Link URL, Position, Active

### 4. Influencer Showcase Management
- **Route**: `/admin/influencers`
- **Features**: List, add, edit, delete, reorder influencers
- **Fields**: Name, Quote, Product Name, Product Description, Image, Instagram Reel URL, Product Price, Position, Active

### 5. Store Locations Management
- **Route**: `/admin/stores`
- **Features**: List, add, edit, delete, reorder stores
- **Fields**: Name, Location, Description, Image, Position, Active

### 6. Social Media Links Management
- **Route**: `/admin/social-media`
- **Features**: Edit links for each platform
- **Fields**: Platform, URL, Active (one row per platform)

---

## Frontend Component Updates

### Components to Update:
1. ✅ `HeroCarousel.tsx` - Already fetches from database
2. ✅ `Banner.tsx` - Already fetches from database
3. ✅ `BannerLuxury.tsx` - Already fetches from database
4. `CategoryShowcase.tsx` - Fetch from `category_showcase_items`
5. `CategorySection.tsx` - Fetch from `luxury_mood_categories`
6. `GiftGuide.tsx` - Fetch from `gift_guide_items`
7. `InfluencerShowcase.tsx` - Fetch from `influencer_showcase_items`
8. `StoreLocations.tsx` - Fetch from `store_locations`
9. `Footer.tsx` - Fetch from `social_media_links`

---

## Implementation Order

### Phase 1: Database & API
1. Create all migration files
2. Create API functions for each section
3. Test database queries

### Phase 2: Admin Pages
1. Category Showcase admin
2. Luxury Moods admin
3. Gift Guide admin
4. Influencer Showcase admin
5. Store Locations admin
6. Social Media Links admin

### Phase 3: Frontend Integration
1. Update all components to fetch from database
2. Add fallback to default images/data
3. Test all sections

---

## Files to Create

### Migrations:
- `supabase/migrations/20250113000003_create_category_showcase.sql`
- `supabase/migrations/20250113000004_create_luxury_moods.sql`
- `supabase/migrations/20250113000005_create_gift_guide.sql`
- `supabase/migrations/20250113000006_create_influencer_showcase.sql`
- `supabase/migrations/20250113000007_create_store_locations.sql`
- `supabase/migrations/20250113000008_create_social_media_links.sql`

### Admin API Functions:
- `src/lib/admin-category-showcase.ts`
- `src/lib/admin-luxury-moods.ts`
- `src/lib/admin-gift-guide.ts`
- `src/lib/admin-influencers.ts`
- `src/lib/admin-stores.ts`
- `src/lib/admin-social-media.ts`

### Frontend API Functions:
- `src/lib/category-showcase.ts`
- `src/lib/luxury-moods.ts`
- `src/lib/gift-guide.ts`
- `src/lib/influencers.ts`
- `src/lib/stores.ts`
- `src/lib/social-media.ts`

### Admin Pages:
- `src/pages/admin/CategoryShowcase.tsx`
- `src/pages/admin/CategoryShowcaseForm.tsx`
- `src/pages/admin/LuxuryMoods.tsx`
- `src/pages/admin/LuxuryMoodsForm.tsx`
- `src/pages/admin/GiftGuide.tsx`
- `src/pages/admin/GiftGuideForm.tsx`
- `src/pages/admin/Influencers.tsx`
- `src/pages/admin/InfluencerForm.tsx`
- `src/pages/admin/Stores.tsx`
- `src/pages/admin/StoreForm.tsx`
- `src/pages/admin/SocialMedia.tsx`

---

## Next Steps

1. **Apply existing migrations** (see SUPABASE_MIGRATION_STEPS.md)
2. **Review this plan** and confirm all sections
3. **Implement Phase 1** (Database & API)
4. **Implement Phase 2** (Admin Pages)
5. **Implement Phase 3** (Frontend Integration)

