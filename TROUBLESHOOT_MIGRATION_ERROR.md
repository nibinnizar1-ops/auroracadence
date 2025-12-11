# Troubleshooting "Failed to fetch" Error

This error usually means there's a network issue or the migration is too complex. Let's break it down into smaller parts.

## 🔧 Solution: Run Migration in Parts

Instead of running the entire migration at once, let's split it into smaller chunks:

---

## Part 1: Create Profiles Table (Run This First)

Copy and run this in SQL Editor:

```sql
-- Create profiles table to store user information in public schema
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  
  -- Additional profile fields
  address JSONB,
  date_of_birth DATE,
  gender TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Create trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

**Click "Run" and wait for success.**

---

## Part 2: Create RLS Policies (Run This Second)

After Part 1 succeeds, run this:

```sql
-- RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

**Click "Run" and wait for success.**

---

## Part 3: Create Function for New Users (Run This Third)

After Part 2 succeeds, run this:

```sql
-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Click "Run" and wait for success.**

---

## Part 4: Create Trigger for New Users (Run This Fourth)

After Part 3 succeeds, run this:

```sql
-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Click "Run" and wait for success.**

---

## Part 5: Create Function for User Updates (Run This Fifth)

After Part 4 succeeds, run this:

```sql
-- Function to sync profile when user metadata changes
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', profiles.full_name),
    avatar_url = COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', profiles.avatar_url),
    updated_at = now()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Click "Run" and wait for success.**

---

## Part 6: Create Trigger for User Updates (Run This Last)

After Part 5 succeeds, run this:

```sql
-- Trigger to update profile when user metadata changes
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();
```

**Click "Run" and wait for success.**

---

## ✅ Alternative: Simplified Version (If Still Having Issues)

If you're still getting errors, try this simplified version first:

```sql
-- Simplified profiles table (without triggers)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

You can add the triggers later if needed.

---

## 🔍 Other Troubleshooting Steps

1. **Check Internet Connection**
   - Make sure you have a stable internet connection
   - Try refreshing the page

2. **Wait and Retry**
   - Supabase might be experiencing temporary issues
   - Wait 1-2 minutes and try again

3. **Clear Browser Cache**
   - Clear your browser cache
   - Try in incognito/private window

4. **Check Supabase Status**
   - Visit https://status.supabase.com/
   - Check if there are any service issues

5. **Try Smaller Queries**
   - Run each part separately (as shown above)
   - This helps identify which part is causing the issue

---

## ✅ After Success

Once the migration succeeds:

1. Go to **Table Editor**
2. You should see the **`profiles`** table
3. When users sign in with Google, profiles will be created automatically

---

**Try running the parts one by one, starting with Part 1!**

