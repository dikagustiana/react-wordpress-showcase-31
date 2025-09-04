-- Fix RLS policies for ops_edit_log table
-- Add INSERT policy for admin/editor users

CREATE POLICY "ops_edit_log_insert_admin_editor"
ON public.ops_edit_log 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin_or_editor(auth.uid()));

-- Also add INSERT policy for green_essays_versions
CREATE POLICY "gev_insert_admin_editor"
ON public.green_essays_versions 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin_or_editor(auth.uid()));