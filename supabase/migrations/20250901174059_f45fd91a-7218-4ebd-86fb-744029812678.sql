-- Add email column to user_roles table if it doesn't exist
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS email text unique;

-- Set your account as admin by user_id (will need to find your user_id first)
-- For now, let's create a function to set admin role by email
create or replace function public.set_admin_by_email(user_email text)
returns void
language plpgsql
security definer
as $$
declare
  user_uuid uuid;
begin
  -- Find user by email
  select id into user_uuid from auth.users where email = user_email;
  
  if user_uuid is not null then
    -- Insert or update user role
    insert into public.user_roles(user_id, email, role)
    values (user_uuid, user_email, 'admin')
    on conflict (user_id) do update set role = 'admin', email = excluded.email;
    
    -- Update JWT metadata
    update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('role', 'admin')
    where id = user_uuid;
  end if;
end;
$$;

-- Set your account as admin
select public.set_admin_by_email('dika.g.irawan@gmail.com');

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
grant execute on function public.set_admin_by_email(text) to anon, authenticated;

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