-- Migration 6: Secure Functions and RPCs — Transport Platform V2
-- Implements internal private helpers, public authenticated RPCs, and service-role-only transactional workflows.

-- ============================================================================
-- 1. PRIVATE HELPERS (Not accessible to authenticated, anon, or public)
-- ============================================================================

create or replace function private.is_profile_active(p_user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_user_id is null then
    return false;
  end if;
  return exists (
    select 1
    from public.profiles p
    where p.id = p_user_id and p.status = 'active'::public.profile_status
  );
end;
$$;

create or replace function private.current_active_tenant_id()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_tenant_id uuid;
begin
  if v_user_id is null then
    return null;
  end if;
  select c.active_tenant_id into v_tenant_id
  from public.user_tenant_context c
  join public.profiles p on p.id = c.user_id
  join public.tenants t on t.id = c.active_tenant_id
  join public.tenant_memberships m on m.tenant_id = t.id and m.user_id = p.id
  where c.user_id = v_user_id
    and p.status = 'active'::public.profile_status
    and t.status = 'active'::public.tenant_status
    and m.status = 'active'::public.membership_status;
  return v_tenant_id;
end;
$$;

create or replace function private.has_active_membership(p_tenant_id uuid, p_user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_tenant_id is null or p_user_id is null then
    return false;
  end if;
  return exists (
    select 1
    from public.tenant_memberships m
    join public.profiles p on p.id = m.user_id
    join public.tenants t on t.id = m.tenant_id
    where m.tenant_id = p_tenant_id
      and m.user_id = p_user_id
      and m.status = 'active'::public.membership_status
      and p.status = 'active'::public.profile_status
      and t.status = 'active'::public.tenant_status
  );
end;
$$;

create or replace function private.is_tenant_admin(p_tenant_id uuid, p_user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_tenant_id is null or p_user_id is null then
    return false;
  end if;
  return exists (
    select 1
    from public.tenant_memberships m
    join public.profiles p on p.id = m.user_id
    join public.tenants t on t.id = m.tenant_id
    where m.tenant_id = p_tenant_id
      and m.user_id = p_user_id
      and m.role = 'tenant_admin'::public.tenant_role
      and m.status = 'active'::public.membership_status
      and p.status = 'active'::public.profile_status
      and t.status = 'active'::public.tenant_status
  );
end;
$$;

revoke all on function private.is_profile_active(uuid) from public, authenticated, anon;
grant execute on function private.is_profile_active(uuid) to service_role;

revoke all on function private.current_active_tenant_id() from public, authenticated, anon;
grant execute on function private.current_active_tenant_id() to service_role;

revoke all on function private.has_active_membership(uuid, uuid) from public, authenticated, anon;
grant execute on function private.has_active_membership(uuid, uuid) to service_role;

revoke all on function private.is_tenant_admin(uuid, uuid) from public, authenticated, anon;
grant execute on function private.is_tenant_admin(uuid, uuid) to service_role;

-- ============================================================================
-- 2. PUBLIC AUTHENTICATED RPCS (Deliberate tenant switching and invitations)
-- ============================================================================

create or replace function public.set_active_tenant(p_tenant_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_new_version integer;
  v_updated_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_tenant_id is null then
    raise exception 'Target tenant ID cannot be null' using errcode = '22004';
  end if;

  if not exists (select 1 from public.profiles where id = v_user_id and status = 'active'::public.profile_status) then
    raise exception 'User profile is suspended or inactive' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.tenants t
    join public.tenant_memberships m on m.tenant_id = t.id
    where t.id = p_tenant_id
      and t.status = 'active'::public.tenant_status
      and m.user_id = v_user_id
      and m.status = 'active'::public.membership_status
  ) then
    raise exception 'Tenant is inactive or user lacks an active membership' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id;

  insert into public.user_tenant_context (user_id, active_tenant_id, version, updated_at)
  values (v_user_id, p_tenant_id, 1, now())
  on conflict (user_id) do update
  set active_tenant_id = excluded.active_tenant_id,
      version = public.user_tenant_context.version + 1,
      updated_at = now()
  returning version, updated_at into v_new_version, v_updated_at;

  insert into public.audit_events (
    actor_user_id,
    actor_email_snapshot,
    tenant_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  ) values (
    v_user_id,
    v_email,
    p_tenant_id,
    'active_tenant_changed'::public.audit_action_type,
    'user_tenant_context'::public.audit_entity_type,
    v_user_id::text,
    jsonb_build_object('active_tenant_id', p_tenant_id, 'version', v_new_version)
  );

  return jsonb_build_object(
    'tenant_id', p_tenant_id,
    'version', v_new_version,
    'updated_at', v_updated_at
  );
end;
$$;

revoke execute on function public.set_active_tenant(uuid) from public, anon;
grant execute on function public.set_active_tenant(uuid) to authenticated;

create or replace function public.accept_tenant_invitation(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_user_email text;
  v_token_hash text;
  v_invitation record;
  v_new_version integer;
  v_updated_at timestamptz;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  if p_token is null or trim(p_token) = '' then
    raise exception 'Invalid invitation token provided' using errcode = '22004';
  end if;

  select lower(trim(email)) into v_user_email
  from auth.users
  where id = v_user_id;

  if v_user_email is null then
    raise exception 'User email not found in auth identity' using errcode = '42501';
  end if;

  if not exists (select 1 from public.profiles where id = v_user_id and status = 'active'::public.profile_status) then
    raise exception 'User profile is suspended or inactive' using errcode = '42501';
  end if;

  v_token_hash := encode(extensions.digest(p_token, 'sha256'), 'hex');

  select * into v_invitation
  from public.tenant_invitations
  where token_hash = v_token_hash
  for update;

  if not found then
    raise exception 'Invitation not found or invalid token' using errcode = 'P0002';
  end if;

  if v_invitation.status = 'accepted'::public.invitation_status then
    raise exception 'Invitation already accepted (replay protection)' using errcode = '42501';
  end if;

  if v_invitation.status = 'revoked'::public.invitation_status then
    raise exception 'Invitation has been revoked' using errcode = '42501';
  end if;

  if v_invitation.expires_at <= now() then
    raise exception 'Invitation has expired' using errcode = '42501';
  end if;

  if v_invitation.normalized_email <> v_user_email then
    raise exception 'Invitation email does not match authenticated user email' using errcode = '42501';
  end if;

  if not exists (select 1 from public.tenants where id = v_invitation.tenant_id and status = 'active'::public.tenant_status) then
    raise exception 'Target tenant is not currently active' using errcode = '42501';
  end if;

  update public.tenant_invitations
  set status = 'accepted'::public.invitation_status,
      accepted_by = v_user_id,
      accepted_at = now(),
      updated_at = now()
  where token_hash = v_token_hash;

  insert into public.tenant_memberships (tenant_id, user_id, role, status, created_at, updated_at)
  values (v_invitation.tenant_id, v_user_id, v_invitation.role, 'active'::public.membership_status, now(), now())
  on conflict (tenant_id, user_id) do update
  set role = excluded.role,
      status = 'active'::public.membership_status,
      updated_at = now();

  insert into public.user_tenant_context (user_id, active_tenant_id, version, updated_at)
  values (v_user_id, v_invitation.tenant_id, 1, now())
  on conflict (user_id) do update
  set active_tenant_id = excluded.active_tenant_id,
      version = public.user_tenant_context.version + 1,
      updated_at = now()
  returning version, updated_at into v_new_version, v_updated_at;

  insert into public.audit_events (
    actor_user_id,
    actor_email_snapshot,
    tenant_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  ) values (
    v_user_id,
    v_user_email,
    v_invitation.tenant_id,
    'invitation_accepted'::public.audit_action_type,
    'tenant_invitation'::public.audit_entity_type,
    v_invitation.id::text,
    jsonb_build_object('role', v_invitation.role)
  );

  return jsonb_build_object(
    'tenant_id', v_invitation.tenant_id,
    'role', v_invitation.role,
    'version', v_new_version,
    'updated_at', v_updated_at
  );
end;
$$;

revoke execute on function public.accept_tenant_invitation(text) from public, anon;
grant execute on function public.accept_tenant_invitation(text) to authenticated;

-- ============================================================================
-- 3. SERVICE-ROLE-ONLY RPCS (SECURITY INVOKER, strictly internal administrative actions)
-- ============================================================================

create or replace function public.create_tenant_with_defaults(
  p_slug text,
  p_legal_name text,
  p_display_name text,
  p_timezone text default 'UTC',
  p_locale text default 'es-CL',
  p_status public.tenant_status default 'active'::public.tenant_status
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_tenant_id uuid;
begin
  if p_slug is null or p_legal_name is null or p_display_name is null then
    raise exception 'Slug, legal name, and display name are required' using errcode = '22004';
  end if;

  insert into public.tenants (slug, legal_name, display_name, timezone, locale, status, activated_at, created_at, updated_at)
  values (
    p_slug,
    p_legal_name,
    p_display_name,
    coalesce(p_timezone, 'UTC'),
    coalesce(p_locale, 'es-CL'),
    p_status,
    case when p_status = 'active'::public.tenant_status then now() else null end,
    now(),
    now()
  )
  returning id into v_tenant_id;

  insert into public.tenant_branding (tenant_id, created_at, updated_at)
  values (v_tenant_id, now(), now());

  insert into public.audit_events (
    actor_user_id,
    actor_email_snapshot,
    tenant_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  ) values (
    null,
    'service_role',
    v_tenant_id,
    'tenant_created'::public.audit_action_type,
    'tenant'::public.audit_entity_type,
    v_tenant_id::text,
    jsonb_build_object('slug', p_slug, 'status', p_status)
  );

  return v_tenant_id;
end;
$$;

revoke execute on function public.create_tenant_with_defaults(text, text, text, text, text, public.tenant_status) from public, anon, authenticated;
grant execute on function public.create_tenant_with_defaults(text, text, text, text, text, public.tenant_status) to service_role;

create or replace function public.activate_tenant(p_tenant_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_tenant_id is null then
    raise exception 'Tenant ID required' using errcode = '22004';
  end if;

  update public.tenants
  set status = 'active'::public.tenant_status,
      activated_at = coalesce(activated_at, now()),
      updated_at = now()
  where id = p_tenant_id;

  if not found then
    raise exception 'Tenant not found' using errcode = 'P0002';
  end if;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'tenant_activated'::public.audit_action_type, 'tenant'::public.audit_entity_type, p_tenant_id::text, '{}'::jsonb);

  return true;
end;
$$;

revoke execute on function public.activate_tenant(uuid) from public, anon, authenticated;
grant execute on function public.activate_tenant(uuid) to service_role;

create or replace function public.suspend_tenant(p_tenant_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_tenant_id is null then
    raise exception 'Tenant ID required' using errcode = '22004';
  end if;

  update public.tenants
  set status = 'suspended'::public.tenant_status,
      suspended_at = now(),
      updated_at = now()
  where id = p_tenant_id;

  if not found then
    raise exception 'Tenant not found' using errcode = 'P0002';
  end if;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'tenant_suspended'::public.audit_action_type, 'tenant'::public.audit_entity_type, p_tenant_id::text, '{}'::jsonb);

  return true;
end;
$$;

revoke execute on function public.suspend_tenant(uuid) from public, anon, authenticated;
grant execute on function public.suspend_tenant(uuid) to service_role;

create or replace function public.archive_tenant(p_tenant_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_tenant_id is null then
    raise exception 'Tenant ID required' using errcode = '22004';
  end if;

  update public.tenants
  set status = 'archived'::public.tenant_status,
      archived_at = now(),
      updated_at = now()
  where id = p_tenant_id;

  if not found then
    raise exception 'Tenant not found' using errcode = 'P0002';
  end if;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'tenant_archived'::public.audit_action_type, 'tenant'::public.audit_entity_type, p_tenant_id::text, '{}'::jsonb);

  return true;
end;
$$;

revoke execute on function public.archive_tenant(uuid) from public, anon, authenticated;
grant execute on function public.archive_tenant(uuid) to service_role;

create or replace function public.create_tenant_invitation(
  p_tenant_id uuid,
  p_email text,
  p_role public.tenant_role default 'tenant_admin'::public.tenant_role,
  p_invited_by uuid default null,
  p_expires_in_hours integer default 72
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_raw_token text;
  v_token_hash text;
  v_invitation_id uuid;
  v_normalized_email text;
begin
  if p_tenant_id is null or p_email is null then
    raise exception 'Tenant ID and email are required' using errcode = '22004';
  end if;

  if not exists (select 1 from public.tenants where id = p_tenant_id) then
    raise exception 'Target tenant does not exist' using errcode = 'P0002';
  end if;

  v_normalized_email := lower(trim(p_email));
  v_raw_token := encode(extensions.gen_random_bytes(32), 'hex');
  v_token_hash := encode(extensions.digest(v_raw_token, 'sha256'), 'hex');

  insert into public.tenant_invitations (
    token_hash,
    tenant_id,
    normalized_email,
    role,
    status,
    invited_by,
    expires_at,
    created_at,
    updated_at
  ) values (
    v_token_hash,
    p_tenant_id,
    v_normalized_email,
    p_role,
    'pending'::public.invitation_status,
    p_invited_by,
    now() + (coalesce(p_expires_in_hours, 72) || ' hours')::interval,
    now(),
    now()
  )
  returning id into v_invitation_id;

  insert into public.audit_events (
    actor_user_id,
    actor_email_snapshot,
    tenant_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  ) values (
    p_invited_by,
    'service_role_inviter',
    p_tenant_id,
    'invitation_created'::public.audit_action_type,
    'tenant_invitation'::public.audit_entity_type,
    v_invitation_id::text,
    jsonb_build_object('email', v_normalized_email, 'role', p_role)
  );

  return v_raw_token;
end;
$$;

revoke execute on function public.create_tenant_invitation(uuid, text, public.tenant_role, uuid, integer) from public, anon, authenticated;
grant execute on function public.create_tenant_invitation(uuid, text, public.tenant_role, uuid, integer) to service_role;

create or replace function public.revoke_tenant_invitation(p_invitation_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_tenant_id uuid;
begin
  if p_invitation_id is null then
    raise exception 'Invitation ID required' using errcode = '22004';
  end if;

  update public.tenant_invitations
  set status = 'revoked'::public.invitation_status,
      revoked_at = now(),
      updated_at = now()
  where id = p_invitation_id and status = 'pending'::public.invitation_status
  returning tenant_id into v_tenant_id;

  if not found then
    raise exception 'Pending invitation not found' using errcode = 'P0002';
  end if;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', v_tenant_id, 'invitation_revoked'::public.audit_action_type, 'tenant_invitation'::public.audit_entity_type, p_invitation_id::text, '{}'::jsonb);

  return true;
end;
$$;

revoke execute on function public.revoke_tenant_invitation(uuid) from public, anon, authenticated;
grant execute on function public.revoke_tenant_invitation(uuid) to service_role;

create or replace function public.set_tenant_module(p_tenant_id uuid, p_module_key text, p_is_enabled boolean)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_setting_id uuid;
begin
  if p_tenant_id is null or p_module_key is null or p_is_enabled is null then
    raise exception 'Tenant ID, module key, and status required' using errcode = '22004';
  end if;

  if not exists (select 1 from public.system_modules where key = p_module_key) then
    raise exception 'Module key does not exist in system_modules catalog' using errcode = 'P0002';
  end if;

  insert into public.tenant_module_settings (tenant_id, module_key, is_enabled, created_at, updated_at)
  values (p_tenant_id, p_module_key, p_is_enabled, now(), now())
  on conflict (tenant_id, module_key) do update
  set is_enabled = excluded.is_enabled,
      updated_at = now()
  returning id into v_setting_id;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'module_updated'::public.audit_action_type, 'tenant_module_setting'::public.audit_entity_type, v_setting_id::text, jsonb_build_object('module_key', p_module_key, 'is_enabled', p_is_enabled));

  return true;
end;
$$;

revoke execute on function public.set_tenant_module(uuid, text, boolean) from public, anon, authenticated;
grant execute on function public.set_tenant_module(uuid, text, boolean) to service_role;

create or replace function public.update_tenant_branding(
  p_tenant_id uuid,
  p_logo_asset_path text default null,
  p_favicon_asset_path text default null,
  p_primary_color_h smallint default 210,
  p_primary_color_s smallint default 80,
  p_primary_color_l smallint default 50,
  p_secondary_color_h smallint default 180,
  p_secondary_color_s smallint default 70,
  p_secondary_color_l smallint default 40,
  p_accent_color_h smallint default 30,
  p_accent_color_s smallint default 90,
  p_accent_color_l smallint default 55
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if p_tenant_id is null then
    raise exception 'Tenant ID required' using errcode = '22004';
  end if;

  insert into public.tenant_branding (
    tenant_id, logo_asset_path, favicon_asset_path,
    primary_color_h, primary_color_s, primary_color_l,
    secondary_color_h, secondary_color_s, secondary_color_l,
    accent_color_h, accent_color_s, accent_color_l,
    created_at, updated_at
  ) values (
    p_tenant_id, p_logo_asset_path, p_favicon_asset_path,
    p_primary_color_h, p_primary_color_s, p_primary_color_l,
    p_secondary_color_h, p_secondary_color_s, p_secondary_color_l,
    p_accent_color_h, p_accent_color_s, p_accent_color_l,
    now(), now()
  )
  on conflict (tenant_id) do update
  set logo_asset_path = excluded.logo_asset_path,
      favicon_asset_path = excluded.favicon_asset_path,
      primary_color_h = excluded.primary_color_h,
      primary_color_s = excluded.primary_color_s,
      primary_color_l = excluded.primary_color_l,
      secondary_color_h = excluded.secondary_color_h,
      secondary_color_s = excluded.secondary_color_s,
      secondary_color_l = excluded.secondary_color_l,
      accent_color_h = excluded.accent_color_h,
      accent_color_s = excluded.accent_color_s,
      accent_color_l = excluded.accent_color_l,
      updated_at = now();

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'branding_updated'::public.audit_action_type, 'tenant_branding'::public.audit_entity_type, p_tenant_id::text, '{}'::jsonb);

  return true;
end;
$$;

revoke execute on function public.update_tenant_branding(uuid, text, text, smallint, smallint, smallint, smallint, smallint, smallint, smallint, smallint, smallint) from public, anon, authenticated;
grant execute on function public.update_tenant_branding(uuid, text, text, smallint, smallint, smallint, smallint, smallint, smallint, smallint, smallint, smallint) to service_role;

create or replace function public.revoke_tenant_membership(p_tenant_id uuid, p_user_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_membership_id uuid;
begin
  if p_tenant_id is null or p_user_id is null then
    raise exception 'Tenant ID and User ID required' using errcode = '22004';
  end if;

  update public.tenant_memberships
  set status = 'revoked'::public.membership_status,
      updated_at = now()
  where tenant_id = p_tenant_id and user_id = p_user_id and status = 'active'::public.membership_status
  returning id into v_membership_id;

  if not found then
    raise exception 'Active membership not found' using errcode = 'P0002';
  end if;

  insert into public.audit_events (actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata)
  values (null, 'service_role', p_tenant_id, 'membership_revoked'::public.audit_action_type, 'tenant_membership'::public.audit_entity_type, coalesce(v_membership_id::text, p_tenant_id::text), jsonb_build_object('user_id', p_user_id));

  return true;
end;
$$;

revoke execute on function public.revoke_tenant_membership(uuid, uuid) from public, anon, authenticated;
grant execute on function public.revoke_tenant_membership(uuid, uuid) to service_role;
