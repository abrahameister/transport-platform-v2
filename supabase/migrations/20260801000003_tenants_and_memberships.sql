-- Migration 3: Tenants and Memberships — Transport Platform V2
-- Establishes core multi-tenant structure and membership tracking.
-- All tenant-scoped foreign keys employ ON DELETE RESTRICT to prevent hard deletions.

create table public.tenants (
  id uuid not null primary key default gen_random_uuid(),
  slug text not null unique,
  legal_name text not null,
  display_name text not null,
  status public.tenant_status not null default 'draft'::public.tenant_status,
  timezone text not null default 'UTC',
  locale text not null default 'es-CL',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  activated_at timestamptz,
  suspended_at timestamptz,
  archived_at timestamptz
);

create trigger update_tenants_updated_at
  before update on public.tenants
  for each row execute function private.update_updated_at_column();

create table public.tenant_memberships (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  role public.tenant_role not null default 'tenant_admin'::public.tenant_role,
  status public.membership_status not null default 'active'::public.membership_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uk_tenant_memberships_tenant_user unique (tenant_id, user_id)
);

create trigger update_tenant_memberships_updated_at
  before update on public.tenant_memberships
  for each row execute function private.update_updated_at_column();
