-- Create user_roles table if not exists
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  email text unique,
  role text not null check (role in ('admin','viewer')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their own role" on public.user_roles;
drop policy if exists "Admins can view all roles" on public.user_roles;

-- Create RLS policies
create policy "Users can view their own role" on public.user_roles
  for select using (auth.uid() = user_id);

create policy "Admins can view all roles" on public.user_roles
  for select using (
    exists (
      select 1 from public.user_roles ur 
      where ur.user_id = auth.uid() and ur.role = 'admin'
    )
  );

-- Seed admin account
insert into public.user_roles(email, role)
values ('dika.g.irawan@gmail.com','admin')
on conflict (email) do update set role = excluded.role;

-- JWT-friendly role reader
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

grant execute on function public.get_user_role() to anon, authenticated;

-- Sync role from user_roles -> auth.users.app_metadata
create or replace function public.apply_role_from_user_roles()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  r text;
begin
  select ur.role into r from public.user_roles ur where ur.user_id = new.id;
  if r is null then
    select ur.role into r from public.user_roles ur where lower(ur.email) = lower(new.email);
  end if;

  if r is not null then
    update auth.users
    set raw_app_meta_data = coalesce(raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('role', r)
    where id = new.id;
  end if;

  return new;
end;
$$;

drop trigger if exists t_apply_role_after_insert on auth.users;
create trigger t_apply_role_after_insert
after insert on auth.users
for each row execute function public.apply_role_from_user_roles();

-- One-time sync for existing users
update auth.users u
set raw_app_meta_data = coalesce(u.raw_app_meta_data,'{}'::jsonb) || jsonb_build_object('role', ur.role)
from public.user_roles ur
where (ur.user_id = u.id or lower(ur.email) = lower(u.email));