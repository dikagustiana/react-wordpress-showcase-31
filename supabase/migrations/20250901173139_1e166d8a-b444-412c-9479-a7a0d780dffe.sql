-- Update the get_user_role function to read from app_metadata
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.users.raw_app_meta_data->>'role')::text,
    'viewer'
  )
  FROM auth.users 
  WHERE auth.users.id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_user_role() TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;