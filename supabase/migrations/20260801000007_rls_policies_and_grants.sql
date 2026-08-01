-- Migration 7: RLS Policies and Grants — Transport Platform V2
-- Enforces fail-closed Row Level Security across all domain tables.
-- Grants authenticated users read-only SELECT access exclusively to their active tenant context.
-- Eliminates direct client DML and prevents RLS evaluation loops or recursion.

alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_memberships enable row level security;
alter table public.user_tenant_context enable row level security;
alter table public.tenant_invitations enable row level security;
alter table public.tenant_branding enable row level security;
alter table public.system_modules enable row level security;
alter table public.tenant_module_settings enable row level security;
alter table public.audit_events enable row level security;

-- Revoke default general access from anon and public
revoke all on table public.profiles from public, anon;
revoke all on table public.tenants from public, anon;
revoke all on table public.tenant_memberships from public, anon;
revoke all on table public.user_tenant_context from public, anon;
revoke all on table public.tenant_invitations from public, anon;
revoke all on table public.tenant_branding from public, anon;
revoke all on table public.system_modules from public, anon;
revoke all on table public.tenant_module_settings from public, anon;
revoke all on table public.audit_events from public, anon, authenticated;

-- Grant strictly limited read-only permissions to authenticated on non-audit domain tables
grant select on table public.profiles to authenticated;
grant select on table public.tenants to authenticated;
grant select on table public.tenant_memberships to authenticated;
grant select on table public.user_tenant_context to authenticated;
grant select on table public.tenant_invitations to authenticated;
grant select on table public.tenant_branding to authenticated;
grant select on table public.system_modules to authenticated;
grant select on table public.tenant_module_settings to authenticated;
grant all on table public.audit_events to service_role;

-- Grant service_role full permissions across domain tables
grant all on table public.profiles to service_role;
grant all on table public.tenants to service_role;
grant all on table public.tenant_memberships to service_role;
grant all on table public.user_tenant_context to service_role;
grant all on table public.tenant_invitations to service_role;
grant all on table public.tenant_branding to service_role;
grant all on table public.system_modules to service_role;
grant all on table public.tenant_module_settings to service_role;

-- ============================================================================
-- FAIL-CLOSED ROW LEVEL SECURITY POLICIES (TO authenticated)
-- ============================================================================

-- 1. PROFILES: User can view their own profile identity
create policy "Users can select their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- 2. USER_TENANT_CONTEXT: Active users can view their own context pointer
create policy "Active users can view their own tenant context"
  on public.user_tenant_context
  for select
  to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
  );

-- 3. SYSTEM_MODULES: Active users can read available system module descriptions
create policy "Active users can view system module catalog"
  on public.system_modules
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
  );

-- 4. TENANT_MEMBERSHIPS: Members can read their own record or admins view all in active tenant
create policy "Active users view memberships in active tenant according to role"
  on public.tenant_memberships
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
    and (
      (user_id = auth.uid() and status = 'active'::public.membership_status)
      or
      exists (
        select 1 from public.tenant_memberships admin_m
        where admin_m.tenant_id = public.tenant_memberships.tenant_id
          and admin_m.user_id = auth.uid()
          and admin_m.role = 'tenant_admin'::public.tenant_role
          and admin_m.status = 'active'::public.membership_status
      )
    )
  );

-- 5. TENANTS: Active users view their active tenant if their membership is valid
create policy "Active users view their current active tenant"
  on public.tenants
  for select
  to authenticated
  using (
    status = 'active'::public.tenant_status
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
    and id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tenant_memberships m
      where m.tenant_id = public.tenants.id
        and m.user_id = auth.uid()
        and m.status = 'active'::public.membership_status
    )
  );

-- 6. TENANT_INVITATIONS: Active tenant_admin can view invitations in their active tenant
create policy "Tenant admins can view invitations in active tenant"
  on public.tenant_invitations
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tenant_memberships m
      where m.tenant_id = public.tenant_invitations.tenant_id
        and m.user_id = auth.uid()
        and m.role = 'tenant_admin'::public.tenant_role
        and m.status = 'active'::public.membership_status
    )
  );

-- 7. TENANT_BRANDING: Active members view branding of their active tenant
create policy "Active members can view branding in active tenant"
  on public.tenant_branding
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tenant_memberships m
      where m.tenant_id = public.tenant_branding.tenant_id
        and m.user_id = auth.uid()
        and m.status = 'active'::public.membership_status
    )
  );

-- 8. TENANT_MODULE_SETTINGS: Active members view enabled modules in active tenant
create policy "Active members can view module settings in active tenant"
  on public.tenant_module_settings
  for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.status = 'active'::public.profile_status
    )
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
    and exists (
      select 1 from public.tenant_memberships m
      where m.tenant_id = public.tenant_module_settings.tenant_id
        and m.user_id = auth.uid()
        and m.status = 'active'::public.membership_status
    )
  );
