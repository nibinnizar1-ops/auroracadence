# Alternative Migration Methods

Since you're having API/security issues with Supabase, here are **3 alternative ways** to apply the migrations:

---

## Method 1: Direct SQL Editor (Copy-Paste) ⭐ RECOMMENDED

This bypasses the API and runs SQL directly.

### Steps:

1. **Open Supabase Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. **Click "New Query"**
4. **Copy the ENTIRE contents** of the migration file
5. **Paste directly** into the SQL Editor
6. **Click "Run"** button (or Ctrl+Enter)
7. **Wait for success**

**Note**: Make sure you're copying the COMPLETE file, including all SQL statements.

---

## Method 2: Supabase CLI (If Installed)

If you have Supabase CLI installed:

```bash
# Navigate to your project root
cd /Users/nibin.nizar/Aurora\ main/auroracadence

# Apply all migrations
supabase db push

# Or apply specific migration
supabase migration up
```

**To install Supabase CLI** (if not installed):
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
```

---

## Method 3: Direct Database Connection (psql)

If you have direct database access:

1. **Get your database connection string** from Supabase:
   - Go to **Settings** → **Database**
   - Copy **Connection string** (URI format)

2. **Run migrations via psql**:

```bash
# Connect to database
psql "your-connection-string"

# Then run each migration file
\i supabase/migrations/20250113000001_add_product_discount_fields.sql
\i supabase/migrations/20250113000002_create_banners_table.sql
# ... and so on
```

---

## Method 4: Break Down Into Smaller Chunks

If the full migration is too large, break it into smaller parts.

For example, for `20250113000008_create_social_media_links.sql`, you can run:

**Part 1: Create Table**
```sql
CREATE TABLE IF NOT EXISTS public.social_media_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Part 2: Create Index**
```sql
CREATE INDEX IF NOT EXISTS idx_social_media_active ON public.social_media_links(is_active);
```

**Part 3: Create Trigger**
```sql
CREATE TRIGGER update_social_media_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

**Part 4: Enable RLS**
```sql
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;
```

**Part 5: Create Policies**
```sql
CREATE POLICY "Anyone can view active social media links" 
ON public.social_media_links 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage social media links" 
ON public.social_media_links 
FOR ALL 
USING (public.is_admin(auth.uid()));
```

**Part 6: Insert Default Data**
```sql
INSERT INTO public.social_media_links (platform, url, icon_name, is_active) VALUES
  ('instagram', 'https://www.instagram.com/auroracadence', 'Instagram', true),
  ('facebook', 'https://www.facebook.com/auroracadence', 'Facebook', true),
  ('twitter', 'https://www.twitter.com/auroracadence', 'Twitter', true),
  ('youtube', 'https://www.youtube.com/@auroracadence', 'Youtube', true)
ON CONFLICT (platform) DO NOTHING;
```

---

## ⭐ RECOMMENDED: Method 1 (Direct Copy-Paste)

**This is the simplest and most reliable method:**

1. Open migration file in your code editor
2. Select ALL (Ctrl+A / Cmd+A)
3. Copy (Ctrl+C / Cmd+C)
4. Go to Supabase Dashboard → SQL Editor
5. Paste (Ctrl+V / Cmd+V)
6. Click "Run"

**This should work even with API restrictions!**

---

## Troubleshooting

### If Method 1 doesn't work:

1. **Check if you're logged in** to Supabase Dashboard
2. **Try a different browser** (Chrome, Firefox, Safari)
3. **Clear browser cache** and try again
4. **Check browser console** for specific error messages
5. **Try incognito/private mode**

### If you get "permission denied":

- Make sure you're the **project owner** or have **admin access**
- Check your organization's security settings

---

## Quick Test

Try running this simple query first to test connectivity:

```sql
SELECT current_database(), current_user;
```

If this works, you can proceed with migrations.

---

**Start with Method 1 - it should work even with API restrictions!** 🚀

