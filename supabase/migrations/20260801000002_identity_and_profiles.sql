-- Migration 2: Identity and Profiles — Transport Platform V2
-- Creates profiles table 1:1 with auth.users and read-only normalized email synchronization.

create table public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text not null,
  status public.profile_status not null default 'active'::public.profile_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function private.update_updated_at_column();

-- Function to synchronize auth.users creations and email updates into profiles
create or replace function private.sync_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.profiles (id, email, status, created_at, updated_at)
    values (
      new.id,
      lower(trim(new.email)),
      'active'::public.profile_status,
      now(),
      now()
    )
    on conflict (id) do update
    set email = excluded.email,
        updated_at = now();
    return new;
  elsif tg_op = 'UPDATE' then
    if new.email is distinct from old.email then
      update public.profiles
      set email = lower(trim(new.email)),
          updated_at = now()
      where id = new.id;
    end if;
    return new;
  end if;
  return null;
end;
$$;

revoke all on function private.sync_user_profile() from public, authenticated, anon;
grant execute on function private.sync_user_profile() to service_role;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.sync_user_profile();

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function private.sync_user_profile();
