-- A. Backup policy aktif sebelum dibersihkan
-- Nonaktifkan RLS sementara untuk user_roles agar tidak error saat drop policy
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- B. Bersihkan semua policy bermasalah di user_roles
DROP POLICY IF EXISTS "users_can_view_own_role" ON public.user_roles;
DROP POLICY IF EXISTS "admins_can_view_all_roles" ON public.user_roles; 
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Drop policy bermasalah di tabel lain yang mungkin bermasalah
DROP POLICY IF EXISTS "Anyone can view published essays or admins can view all" ON public.green_essays;
DROP POLICY IF EXISTS "Only admins can create essays" ON public.green_essays;
DROP POLICY IF EXISTS "Only admins can update essays" ON public.green_essays;
DROP POLICY IF EXISTS "Only admins can delete essays" ON public.green_essays;

DROP POLICY IF EXISTS "Only admins can view versions" ON public.green_essays_versions;
DROP POLICY IF EXISTS "Only admins can create versions" ON public.green_essays_versions;

DROP POLICY IF EXISTS "Only admins can view edit log" ON public.ops_edit_log;
DROP POLICY IF EXISTS "Only admins can create edit log" ON public.ops_edit_log;

-- C. Buat fungsi helper aman untuk cek role - SECURITY DEFINER, STABLE
CREATE OR REPLACE FUNCTION public.is_admin_or_editor(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = uid
      AND ur.role IN ('admin', 'editor')
  );
$$;

-- Grant execute ke authenticated role
GRANT EXECUTE ON FUNCTION public.is_admin_or_editor(uuid) TO authenticated;

-- D. RLS minimal dan aman untuk user_roles
-- Aktifkan kembali RLS 
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy SELECT hanya untuk baris milik sendiri (tanpa recursion)
CREATE POLICY "user_roles_select_self"
ON public.user_roles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());