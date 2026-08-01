-- Migration 4: Private Context, Invitations, and Audit Events — Transport Platform V2
-- Establishes global active tenant context, invitation token hashing, and append-only audit tracking.

create table public.user_tenant_context (
  user_id uuid not null primary key references public.profiles(id) on delete restrict,
  active_tenant_id uuid references public.tenants(id) on delete restrict,
  updated_at timestamptz not null default now(),
  version integer not null default 1
);

create trigger update_user_tenant_context_updated_at
  before update on public.user_tenant_context
  for each row execute function private.update_updated_at_column();

-- Automatically clear active tenant context when profiles/tenants are suspended or memberships revoked
create or replace function private.handle_status_revocation_context()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'profiles' then
    if new.status <> 'active'::public.profile_status then
      update public.user_tenant_context
      set active_tenant_id = null, version = version + 1, updated_at = now()
      where user_id = new.id;
    end if;
  elsif tg_table_name = 'tenants' then
    if new.status <> 'active'::public.tenant_status then
      update public.user_tenant_context
      set active_tenant_id = null, version = version + 1, updated_at = now()
      where active_tenant_id = new.id;
    end if;
  elsif tg_table_name = 'tenant_memberships' then
    if new.status = 'revoked'::public.membership_status then
      update public.user_tenant_context
      set active_tenant_id = null, version = version + 1, updated_at = now()
      where user_id = new.user_id and active_tenant_id = new.tenant_id;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function private.handle_status_revocation_context() from public, authenticated, anon;
grant execute on function private.handle_status_revocation_context() to service_role;

create trigger on_profile_status_change
  after update of status on public.profiles
  for each row execute function private.handle_status_revocation_context();

create trigger on_tenant_status_change
  after update of status on public.tenants
  for each row execute function private.handle_status_revocation_context();

create trigger on_membership_status_change
  after update of status on public.tenant_memberships
  for each row execute function private.handle_status_revocation_context();

create table public.tenant_invitations (
  id uuid not null primary key default gen_random_uuid(),
  token_hash text not null unique,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  normalized_email text not null,
  role public.tenant_role not null default 'tenant_admin'::public.tenant_role,
  status public.invitation_status not null default 'pending'::public.invitation_status,
  invited_by uuid references public.profiles(id) on delete set null,
  accepted_by uuid references public.profiles(id) on delete set null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_tenant_invitations_updated_at
  before update on public.tenant_invitations
  for each row execute function private.update_updated_at_column();

create table public.audit_events (
  id uuid not null primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_email_snapshot text,
  tenant_id uuid references public.tenants(id) on delete restrict,
  action_type public.audit_action_type not null,
  entity_type public.audit_entity_type not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  correlation_id text,
  created_at timestamptz not null default now()
);

-- Enforce strict append-only behavior on audit_events at database engine level
create or replace function private.reject_audit_alteration()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception 'audit_events table is append-only: % operations are strictly forbidden', tg_op using errcode = '42501';
end;
$$;

revoke all on function private.reject_audit_alteration() from public, authenticated, anon;
grant execute on function private.reject_audit_alteration() to service_role;

create trigger protect_audit_events
  before update or delete on public.audit_events
  for each row execute function private.reject_audit_alteration();
