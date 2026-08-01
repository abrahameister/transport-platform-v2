-- Migration 5: Branding and Module Catalog — Transport Platform V2
-- Establishes controlled semantic HSL styling and dynamic system module catalog.
-- Strict validation rejects absolute HTTP/HTTPS URLs in storage asset paths.
-- system_modules begins empty, avoiding premature module keys prior to canonical PR 2 definitions.

create table public.tenant_branding (
  tenant_id uuid not null primary key references public.tenants(id) on delete restrict,
  logo_asset_path text check (logo_asset_path is null or logo_asset_path !~ '^https?://'),
  favicon_asset_path text check (favicon_asset_path is null or favicon_asset_path !~ '^https?://'),
  primary_color_h smallint check (primary_color_h >= 0 and primary_color_h <= 360) default 210,
  primary_color_s smallint check (primary_color_s >= 0 and primary_color_s <= 100) default 80,
  primary_color_l smallint check (primary_color_l >= 0 and primary_color_l <= 100) default 50,
  secondary_color_h smallint check (secondary_color_h >= 0 and secondary_color_h <= 360) default 180,
  secondary_color_s smallint check (secondary_color_s >= 0 and secondary_color_s <= 100) default 70,
  secondary_color_l smallint check (secondary_color_l >= 0 and secondary_color_l <= 100) default 40,
  accent_color_h smallint check (accent_color_h >= 0 and accent_color_h <= 360) default 30,
  accent_color_s smallint check (accent_color_s >= 0 and accent_color_s <= 100) default 90,
  accent_color_l smallint check (accent_color_l >= 0 and accent_color_l <= 100) default 55,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_tenant_branding_updated_at
  before update on public.tenant_branding
  for each row execute function private.update_updated_at_column();

create table public.system_modules (
  key text not null primary key,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger update_system_modules_updated_at
  before update on public.system_modules
  for each row execute function private.update_updated_at_column();

create table public.tenant_module_settings (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  module_key text not null references public.system_modules(key) on delete restrict,
  is_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uk_tenant_module_settings unique (tenant_id, module_key)
);

create trigger update_tenant_module_settings_updated_at
  before update on public.tenant_module_settings
  for each row execute function private.update_updated_at_column();
