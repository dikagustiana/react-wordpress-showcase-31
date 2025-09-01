-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create index on user_id for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Create or replace the get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce((
    SELECT role FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1
  ), 'viewer');
$$;

-- Create is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user() 
RETURNS boolean
LANGUAGE sql 
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  );
$$;

-- Enable RLS on all tables
ALTER TABLE public.fsli_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsli_sections ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.fsli_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsli_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "read_pages_all" ON public.fsli_pages;
DROP POLICY IF EXISTS "read_sections_all" ON public.fsli_sections;
DROP POLICY IF EXISTS "read_metrics_all" ON public.fsli_metrics;
DROP POLICY IF EXISTS "read_embeds_all" ON public.embeds;
DROP POLICY IF EXISTS "read_revisions_admin" ON public.fsli_revisions;
DROP POLICY IF EXISTS "write_pages_admin" ON public.fsli_pages;
DROP POLICY IF EXISTS "write_sections_admin" ON public.fsli_sections;
DROP POLICY IF EXISTS "write_metrics_admin" ON public.fsli_metrics;
DROP POLICY IF EXISTS "write_embeds_admin" ON public.embeds;
DROP POLICY IF EXISTS "write_revisions_admin" ON public.fsli_revisions;

-- Create read policies (public access)
CREATE POLICY "read_pages_all" ON public.fsli_pages FOR SELECT USING (true);
CREATE POLICY "read_sections_all" ON public.fsli_sections FOR SELECT USING (true);
CREATE POLICY "read_metrics_all" ON public.fsli_metrics FOR SELECT USING (true);
CREATE POLICY "read_embeds_all" ON public.embeds FOR SELECT USING (true);
CREATE POLICY "read_revisions_admin" ON public.fsli_revisions FOR SELECT USING (public.is_admin_user());

-- Create write policies (admin only)
CREATE POLICY "write_pages_admin" ON public.fsli_pages FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "write_sections_admin" ON public.fsli_sections FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "write_metrics_admin" ON public.fsli_metrics FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "write_embeds_admin" ON public.embeds FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE POLICY "write_revisions_admin" ON public.fsli_revisions FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- User roles policies
CREATE POLICY "users_can_view_own_role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admins_can_view_all_roles" ON public.user_roles FOR SELECT USING (public.is_admin_user());

-- Grant permissions on functions
REVOKE ALL ON FUNCTION public.get_user_role() FROM public;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- Create trigger for updating user_roles updated_at
CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_roles_updated_at();