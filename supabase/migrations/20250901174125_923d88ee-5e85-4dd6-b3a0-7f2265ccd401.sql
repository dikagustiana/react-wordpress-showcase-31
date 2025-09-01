-- Fix security warnings by setting search_path for functions
create or replace function public.set_admin_by_email(user_email text)
returns void
language plpgsql
security definer
set search_path = public
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

create or replace function public.apply_role_from_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
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