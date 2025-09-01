-- Create user_roles table for role management
create table if not exists public.user_roles (
  user_id uuid unique,
  email text unique,
  role text not null check (role in ('admin','viewer'))
);

-- Set your account as admin
insert into public.user_roles(email, role)
values ('dika.g.irawan@gmail.com','admin')
on conflict (email) do update set role = excluded.role;

-- Update get_user_role function to read from JWT metadata first
create or replace function public.get_user_role()
returns text
language sql
security definer
set search_path = public
as $$
  select coalesce((u.raw_app_meta_data->>'role')::text, 'viewer')
  from auth.users u
  where u.id = auth.uid();
$$;

-- Grant execute permissions
grant execute on function public.get_user_role() to anon, authenticated;

-- Function to apply role from user_roles table to JWT metadata
create or replace function public.apply_role_from_user_roles()
returns trigger
language plpgsql
security definer
as $$
declare
  r text;
begin
  -- Try to find role by user_id first
  select ur.role into r from public.user_roles ur where ur.user_id = new.id;
  
  -- If not found, try by email
  if r is null then
    select ur.role into r from public.user_roles ur where lower(ur.email) = lower(new.email);
  end if;

  -- If role found, update the user's app metadata
  if r is not null then
    update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('role', r)
    where id = new.id;
  end if;

  return new;
end;
$$;

-- Create trigger to automatically apply roles on user creation
drop trigger if exists t_apply_role_after_insert on auth.users;
create trigger t_apply_role_after_insert
after insert on auth.users
for each row execute function public.apply_role_from_user_roles();

-- Update existing users with roles from user_roles table
update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('role', ur.role)
from public.user_roles ur
where (ur.user_id = u.id or lower(ur.email) = lower(u.email));