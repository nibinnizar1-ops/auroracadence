-- Fix Coupons RLS Policies
-- Add admin policies for INSERT, UPDATE, DELETE

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can view all coupons" ON public.coupons;

-- Admin can view all coupons (including inactive)
CREATE POLICY "Admins can view all coupons" 
ON public.coupons 
FOR SELECT 
USING (public.is_admin(auth.uid()) = true);

-- Admin can insert coupons
CREATE POLICY "Admins can insert coupons" 
ON public.coupons 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Admin can update coupons
CREATE POLICY "Admins can update coupons" 
ON public.coupons 
FOR UPDATE 
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Admin can delete coupons
CREATE POLICY "Admins can delete coupons" 
ON public.coupons 
FOR DELETE 
USING (public.is_admin(auth.uid()) = true);

