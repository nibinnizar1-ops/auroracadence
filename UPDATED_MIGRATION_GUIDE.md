# Updated Migration Guide (Social Media Skipped)

## ✅ Changes Made

**Social Media Links**: Now stored in frontend (`src/components/Footer.tsx`) instead of database.

**Why?**: To avoid API/security issues with Supabase organization restrictions.

---

## 📋 Migrations to Apply (7 migrations only)

You only need to apply **7 migrations** now (instead of 8):

1. ✅ `20250113000001_add_product_discount_fields.sql`
2. ✅ `20250113000002_create_banners_table.sql`
3. ✅ `20250113000003_create_category_showcase.sql`
4. ✅ `20250113000004_create_luxury_moods.sql`
5. ✅ `20250113000005_create_gift_guide.sql`
6. ✅ `20250113000006_create_influencer_showcase.sql`
7. ✅ `20250113000007_create_store_locations.sql`

**SKIP**: `20250113000008_create_social_media_links.sql` ❌

---

## 🔧 How to Update Social Media Links

Since social links are now in the frontend, update them directly in code:

### File: `src/components/Footer.tsx`

Find this section (around line 5-10):

```typescript
const socialLinks = [
  { url: "https://www.instagram.com/auroracadence", icon: Instagram, label: "Instagram" },
  { url: "https://www.facebook.com/auroracadence", icon: Facebook, label: "Facebook" },
  { url: "https://www.twitter.com/auroracadence", icon: Twitter, label: "Twitter" },
  { url: "https://www.youtube.com/@auroracadence", icon: Youtube, label: "YouTube" },
];
```

**Just update the URLs directly!** No database needed.

---

## ✅ What's Been Updated

1. ✅ **Footer Component** - Now uses hardcoded links
2. ✅ **Admin Routes** - Social Media route commented out
3. ✅ **Admin Layout** - Social Media nav item removed
4. ✅ **No Database Dependency** - Social links work without migrations

---

## 🚀 Apply Migrations

Follow the same steps as before, but **skip migration #8**.

**Steps:**
1. Go to Supabase Dashboard → SQL Editor
2. Apply migrations 1-7 (in order)
3. Skip migration #8
4. Done! ✅

---

## 📝 Summary

- **7 migrations** to apply (not 8)
- **Social links** stored in frontend code
- **Easy to update** - just edit `Footer.tsx`
- **No API issues** - no database dependency for social links

---

**You're all set! Apply migrations 1-7 and you're done!** 🎉

