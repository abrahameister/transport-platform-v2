-- Migration 1: Domain Types and Enums — Transport Platform V2
-- Establishes domain enums and basic schema hardening.
-- Revokes general CREATE on schema public from PUBLIC.
-- Establishes private schema for internal authorization and RLS helpers.

-- Revoke public CREATE on public schema
revoke create on schema public from public;

-- Create private schema for internal security helpers
create schema if not exists private;
revoke all on schema private from public, authenticated, anon;

-- Domain Enums
create type public.profile_status as enum ('active', 'suspended', 'inactive');
create type public.tenant_status as enum ('draft', 'active', 'suspended', 'archived');
create type public.tenant_role as enum ('tenant_admin');
create type public.membership_status as enum ('active', 'revoked');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked');
create type public.audit_action_type as enum (
  'tenant_created',
  'tenant_activated',
  'tenant_suspended',
  'tenant_archived',
  'membership_created',
  'membership_reactivated',
  'membership_revoked',
  'invitation_created',
  'invitation_accepted',
  'invitation_revoked',
  'active_tenant_changed',
  'branding_updated',
  'module_updated',
  'profile_created',
  'profile_email_updated'
);
create type public.audit_entity_type as enum (
  'profile',
  'tenant',
  'tenant_membership',
  'user_tenant_context',
  'tenant_invitation',
  'tenant_branding',
  'tenant_module_setting'
);

-- Reusable timestamp trigger function in private schema
create or replace function private.update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.update_updated_at_column() from public, authenticated, anon;
grant usage on schema private to service_role;
grant execute on function private.update_updated_at_column() to service_role;
