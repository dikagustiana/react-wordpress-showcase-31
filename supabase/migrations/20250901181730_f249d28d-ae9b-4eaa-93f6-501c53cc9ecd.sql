-- Create RLS policy for fsli_sections UPDATE operations for admin users
CREATE POLICY "fsli_sections_update_admin"
ON public.fsli_sections
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Create RLS policy for fsli_pages UPDATE operations for admin users
CREATE POLICY "fsli_pages_update_admin"
ON public.fsli_pages
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Create RLS policy for fsli_metrics UPDATE operations for admin users
CREATE POLICY "fsli_metrics_update_admin"
ON public.fsli_metrics
FOR UPDATE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');