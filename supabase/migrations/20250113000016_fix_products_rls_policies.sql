-- Fix Products RLS Policies
-- Add admin policies for INSERT, UPDATE, DELETE

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

DROP POLICY IF EXISTS "Admins can view all variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can insert variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can update variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins can delete variants" ON public.product_variants;

DROP POLICY IF EXISTS "Admins can view all images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can insert images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can update images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can delete images" ON public.product_images;

-- Products: Admin can view all (including draft/archived)
CREATE POLICY "Admins can view all products" 
ON public.products 
FOR SELECT 
USING (public.is_admin(auth.uid()) = true);

-- Products: Admin can insert
CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Products: Admin can update
CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Products: Admin can delete
CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (public.is_admin(auth.uid()) = true);

-- Product Variants: Admin can view all
CREATE POLICY "Admins can view all variants" 
ON public.product_variants 
FOR SELECT 
USING (public.is_admin(auth.uid()) = true);

-- Product Variants: Admin can insert
CREATE POLICY "Admins can insert variants" 
ON public.product_variants 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Product Variants: Admin can update
CREATE POLICY "Admins can update variants" 
ON public.product_variants 
FOR UPDATE 
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Product Variants: Admin can delete
CREATE POLICY "Admins can delete variants" 
ON public.product_variants 
FOR DELETE 
USING (public.is_admin(auth.uid()) = true);

-- Product Images: Admin can view all
CREATE POLICY "Admins can view all images" 
ON public.product_images 
FOR SELECT 
USING (public.is_admin(auth.uid()) = true);

-- Product Images: Admin can insert
CREATE POLICY "Admins can insert images" 
ON public.product_images 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Product Images: Admin can update
CREATE POLICY "Admins can update images" 
ON public.product_images 
FOR UPDATE 
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Product Images: Admin can delete
CREATE POLICY "Admins can delete images" 
ON public.product_images 
FOR DELETE 
USING (public.is_admin(auth.uid()) = true);

