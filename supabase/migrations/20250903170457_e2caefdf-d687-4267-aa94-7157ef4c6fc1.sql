-- E. RLS untuk tabel konten memakai fungsi helper, tanpa join

-- 1. green_essays policies
CREATE POLICY "ge_select_all"
ON public.green_essays 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "ge_insert_editor_admin"
ON public.green_essays 
FOR INSERT 
TO authenticated 
WITH CHECK (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "ge_update_editor_admin"
ON public.green_essays 
FOR UPDATE 
TO authenticated 
USING (public.is_admin_or_editor(auth.uid()))
WITH CHECK (public.is_admin_or_editor(auth.uid()));

-- 2. green_essays_versions policies
CREATE POLICY "gev_select_all"
ON public.green_essays_versions 
FOR SELECT 
TO authenticated 
USING (true);

-- INSERT hanya via service role (tidak perlu policy untuk authenticated)

-- 3. ops_edit_log policies  
CREATE POLICY "oel_select_all"
ON public.ops_edit_log 
FOR SELECT 
TO authenticated 
USING (true);

-- INSERT hanya via service role (tidak perlu policy untuk authenticated)