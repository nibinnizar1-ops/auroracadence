-- Create store_locations table
CREATE TABLE IF NOT EXISTS public.store_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_store_locations_position ON public.store_locations(position);
CREATE INDEX IF NOT EXISTS idx_store_locations_active ON public.store_locations(is_active);

-- Create trigger to update updated_at
CREATE TRIGGER update_store_locations_updated_at
BEFORE UPDATE ON public.store_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.store_locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active stores
CREATE POLICY "Anyone can view active store locations" 
ON public.store_locations 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage store locations" 
ON public.store_locations 
FOR ALL 
USING (public.is_admin(auth.uid()));

