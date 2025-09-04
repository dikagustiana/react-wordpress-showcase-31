-- Update RLS policies to be more robust
DROP POLICY IF EXISTS "Admins can insert books" ON public.books_uploads;
DROP POLICY IF EXISTS "Admins can update books" ON public.books_uploads;
DROP POLICY IF EXISTS "Admins can upload books" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete books" ON storage.objects;

-- Create more robust policies that work with both auth methods
CREATE POLICY "Authenticated users can insert books if admin" 
ON public.books_uploads 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    is_admin() OR 
    is_admin_user() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
);

CREATE POLICY "Authenticated users can update books if admin" 
ON public.books_uploads 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    is_admin() OR 
    is_admin_user() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
);

-- Storage policies with better auth checks
CREATE POLICY "Authenticated admins can upload books" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'books' AND 
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    ) OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

CREATE POLICY "Authenticated admins can delete books" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'books' AND 
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    ) OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);