# How to Generate Supabase TypeScript Types

## Method 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/rpfvnjaggkhmucosijji
   - Click on **"Settings"** (gear icon) in the left sidebar
   - Click on **"API"** in the settings menu

2. **Generate Types**
   - Scroll down to **"Generate TypeScript types"** section
   - Select **"TypeScript"** as the language
   - Click **"Generate types"**
   - Copy the generated types

3. **Update the File**
   - Open `src/integrations/supabase/types.ts`
   - Replace the entire content with the generated types
   - Save the file

## Method 2: Using Supabase CLI (If Linked)

If you have Supabase CLI linked to your project:

```bash
npx supabase gen types typescript --linked > src/integrations/supabase/types.ts
```

## Method 3: Using Supabase CLI with Project ID

```bash
npx supabase gen types typescript --project-id rpfvnjaggkhmucosijji > src/integrations/supabase/types.ts
```

**Note:** This requires authentication. You may need to run:
```bash
npx supabase login
```

## Method 4: Manual Update (If Above Methods Fail)

The types file needs to include all tables. Currently it only has `orders`. You can manually add the missing tables based on the migrations, but this is time-consuming.

## After Generating Types

1. The TypeScript errors in `admin-stores.ts` should disappear
2. All Supabase queries will have proper type checking
3. IntelliSense will work better in your IDE

## Current Status

- ✅ Duplicate files cleaned up
- ⏳ Types generation needed (use Method 1 - Dashboard - it's the easiest!)

