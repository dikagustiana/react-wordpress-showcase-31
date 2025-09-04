-- Security Fix Phase 1: Fix Critical Data Exposure Issues (Fixed)

-- 1. Fix profiles table - remove and recreate policies properly
DROP POLICY IF EXISTS "Admins can view all profiles securely" ON public.profiles;

-- Create more restrictive policy for admin profile viewing
CREATE POLICY "Admins can view all profiles securely" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can only see their own profile OR be an admin
  (auth.uid() = id) OR is_admin()
);

-- 2. Fix books_uploads table - restrict metadata access to authenticated users
DROP POLICY IF EXISTS "Anyone can view non-deleted books" ON public.books_uploads;

-- Create policy requiring authentication for viewing book metadata
CREATE POLICY "Authenticated users can view non-deleted books" 
ON public.books_uploads 
FOR SELECT 
USING (
  (deleted_at IS NULL) AND (auth.uid() IS NOT NULL)
);

-- 3. Fix green_essays access - ensure only published essays are publicly visible
DROP POLICY IF EXISTS "Public can view published essays only" ON public.green_essays;

CREATE POLICY "Public can view published essays only" 
ON public.green_essays 
FOR SELECT 
USING (
  (status = 'published') OR 
  (status = 'draft' AND is_admin_or_editor(auth.uid()))
);