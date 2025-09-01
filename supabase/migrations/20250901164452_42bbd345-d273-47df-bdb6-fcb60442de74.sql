-- Create secure RPC function to get user role
create or replace function public.get_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((
    select role from public.user_roles
    where user_id = auth.uid()
    limit 1
  ), 'viewer');
$$;

-- Set proper permissions
revoke all on function public.get_user_role() from public;
grant execute on function public.get_user_role() to authenticated;