-- Block 1 RLS & Isolation Verification Test Suite — Transport Platform V2 (pgTAP)
-- Verifies zero access for anon/inactive/unscoped users, tenant isolation, DML denial, hardened RPCs, and asset/slug constraints.
-- All tests run inside a single transaction and terminate with ROLLBACK to leave zero persisted fixtures.

begin;

select plan(48);

-- ============================================================================
-- SETUP FIXTURES AS SERVICE_ROLE / SUPERUSER (Within transaction)
-- ============================================================================

-- Create test identities in auth.users (triggers profile creation via private.sync_user_profile)
insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'bob@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'charlie@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'dave@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'eve@transport.dev', null, '{}'::jsonb, '{}'::jsonb, now(), now());

-- Verify profile creation
select is(
  (select email from public.profiles where id = '11111111-1111-1111-1111-111111111111'::uuid),
  'alice@transport.dev',
  '1. Profile automatically created and synchronized on auth.users insert'
);

-- Create temporary storage for test identifiers
create temporary table _test_ids (
  tenant_a uuid,
  tenant_b uuid,
  tenant_c uuid,
  inv_token text,
  inv_eve_token text,
  inv_exp_token text,
  inv_rev_token text,
  inv_other_token text
);

-- Test create_tenant_with_defaults creates draft status and requires actor
do $$
declare
  v_id_a uuid;
  v_id_b uuid;
  v_id_c uuid;
begin
  v_id_a := public.create_tenant_with_defaults('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', 'tenant-a', 'Tenant A Legal S.A.', 'Tenant A Express', 'UTC', 'es-CL');
  v_id_b := public.create_tenant_with_defaults('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', 'tenant-b', 'Tenant B Legal S.A.', 'Tenant B Logistics', 'UTC', 'es-CL');
  v_id_c := public.create_tenant_with_defaults('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', 'tenant-c', 'Tenant C Legal S.A.', 'Tenant C Cargo', 'UTC', 'es-CL');

  insert into _test_ids (tenant_a, tenant_b, tenant_c) values (v_id_a, v_id_b, v_id_c);
end;
$$;

select is(
  (select status::text from public.tenants where id = (select tenant_a from _test_ids)),
  'draft',
  '2. create_tenant_with_defaults siempre crea el tenant en estado draft'
);

-- Activate Tenant A and Tenant B via activate_tenant RPC inside DO block
do $$
begin
  perform public.activate_tenant('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', (select tenant_a from _test_ids));
  perform public.activate_tenant('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', (select tenant_b from _test_ids));
end;
$$;

select is(
  (select status::text from public.tenants where id = (select tenant_a from _test_ids)),
  'active',
  '3. Activación del tenant ocurre exitosa y exclusivamente a través de activate_tenant()'
);

select ok(
  (select count(*)::integer > 0 from public.audit_events where actor_user_id = '11111111-1111-1111-1111-111111111111'::uuid and actor_email_snapshot = 'alice@transport.dev' and action_type = 'tenant_activated'),
  '4. Identidad del actor real verificada y registrada en auditoría en la misma transacción'
);

select throws_ok(
  'select public.create_tenant_with_defaults(''old-slug'', ''Old Legal'', ''Old Display'', ''UTC'', ''es-CL'', ''active''::public.tenant_status)',
  null,
  null,
  '5. Firma anterior de create_tenant_with_defaults que permitía parámetro p_status ha sido eliminada y no puede invocarse'
);

-- Create active memberships for Alice in Tenant A, Bob in Tenant B, Charlie in Tenant A
insert into public.tenant_memberships (tenant_id, user_id, role, status)
select tenant_a, '11111111-1111-1111-1111-111111111111'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids
union all
select tenant_b, '22222222-2222-2222-2222-222222222222'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids
union all
select tenant_a, '33333333-3333-3333-3333-333333333333'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids;

-- Set active tenant context for Alice and Bob
insert into public.user_tenant_context (user_id, active_tenant_id)
select '11111111-1111-1111-1111-111111111111'::uuid, tenant_a from _test_ids
union all
select '22222222-2222-2222-2222-222222222222'::uuid, tenant_b from _test_ids;

-- Generate invitation tokens
do $$
declare
  v_a uuid;
  v_b uuid;
  v_token text;
  v_eve_token text;
  v_exp_token text;
  v_rev_token text;
  v_other text;
  v_rev_id uuid;
begin
  select tenant_a, tenant_b into v_a, v_b from _test_ids;

  v_token := public.create_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_b, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, 72);
  v_eve_token := public.create_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_b, 'eve@transport.dev', 'tenant_admin'::public.tenant_role, 72);
  v_exp_token := public.create_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_a, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, 72);
  v_rev_token := public.create_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_a, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, 72);
  v_other := public.create_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_a, 'someoneelse@transport.dev', 'tenant_admin'::public.tenant_role, 72);

  -- Force expire v_exp_token
  update public.tenant_invitations set expires_at = now() - interval '2 hours' where token_hash = encode(extensions.digest(v_exp_token, 'sha256'), 'hex');

  -- Revoke v_rev_token via RPC with verified actor inside DO block
  select id into v_rev_id from public.tenant_invitations where token_hash = encode(extensions.digest(v_rev_token, 'sha256'), 'hex');
  perform public.revoke_tenant_invitation('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', v_rev_id);

  update _test_ids set inv_token = v_token, inv_eve_token = v_eve_token, inv_exp_token = v_exp_token, inv_rev_token = v_rev_token, inv_other_token = v_other;
end;
$$;

-- Grant minimal read permissions on temporary fixtures to application roles
grant select on table _test_ids to anon, authenticated, service_role;

-- ============================================================================
-- TEST CASE 1: Anónimos obtienen cero acceso
-- ============================================================================

set role anon;

select throws_ok(
  'select * from public.tenants',
  null,
  null,
  '6. Anónimos obtienen cero acceso (permiso denegado por defecto en tenants)'
);

select throws_ok(
  'select * from public.profiles',
  null,
  null,
  '7. Anónimos obtienen cero acceso a perfiles'
);

-- ============================================================================
-- TEST CASE 2: Authenticated sin tenant activo obtiene cero acceso
-- ============================================================================

reset role;
select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '44444444-4444-4444-4444-444444444444')::text, true);
select set_config('request.jwt.claim.sub', '44444444-4444-4444-4444-444444444444', true);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '8. Usuario autenticado sin tenant activo obtiene cero filas en tenants'
);

select is(
  (select count(*)::integer from public.tenant_branding),
  0,
  '9. Usuario autenticado sin tenant activo obtiene cero filas en branding'
);

-- ============================================================================
-- TEST CASE 3: Tenant A no lee ni modifica Tenant B & Sin recursión RLS
-- ============================================================================

-- Switch to Alice (Tenant A Admin)
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select is(
  (select count(*)::integer from public.tenants where id = (select tenant_a from _test_ids)),
  1,
  '10. Tenant A lee su propio tenant activo'
);

select is(
  (select count(*)::integer from public.tenants where id = (select tenant_b from _test_ids)),
  0,
  '11. Tenant A no lee Tenant B'
);

select throws_ok(
  'update public.tenants set display_name = ''Hacked'' where id = (select tenant_b from _test_ids)',
  null,
  null,
  '12. Tenant A no modifica Tenant B'
);

select is(
  (select count(*)::integer from public.tenant_memberships),
  2,
  '13. Tenant admin puede leer únicamente las memberships de su tenant activo sin recursión RLS infinita'
);

-- ============================================================================
-- TEST CASE 4: DML directo denegado en tablas sensibles para authenticated
-- ============================================================================

select throws_ok(
  'delete from public.profiles where id = ''11111111-1111-1111-1111-111111111111''',
  null,
  null,
  '14. DML directo (DELETE) denegado en profiles'
);

select throws_ok(
  'insert into public.tenant_memberships (tenant_id, user_id) values ((select tenant_a from _test_ids), ''44444444-4444-4444-4444-444444444444'')',
  null,
  null,
  '15. DML directo (INSERT) denegado en tenant_memberships'
);

select throws_ok(
  'insert into public.audit_events (action_type, entity_type) values (''tenant_created'', ''tenant'')',
  null,
  null,
  '16. DML directo (INSERT) denegado en audit_events'
);

select throws_ok(
  'select * from public.audit_events',
  null,
  null,
  '17. SELECT denegado a authenticated en audit_events en PR 1'
);

-- ============================================================================
-- TEST CASE 5: Prohibida la invocación de RPCs service-role y helpers privados
-- ============================================================================

select throws_ok(
  'select public.activate_tenant(''11111111-1111-1111-1111-111111111111''::uuid, ''alice@transport.dev'', (select tenant_a from _test_ids))',
  null,
  null,
  '18. authenticated no invoca RPCs service-role-only (activate_tenant)'
);

select throws_ok(
  'select public.create_tenant_with_defaults(''11111111-1111-1111-1111-111111111111''::uuid, ''alice@transport.dev'', ''hacked'', ''Hacked'', ''Hacked'')',
  null,
  null,
  '19. authenticated no invoca RPCs service-role-only (create_tenant_with_defaults)'
);

select throws_ok(
  'select private.current_active_tenant_id()',
  null,
  null,
  '20. authenticated no invoca helpers privados (current_active_tenant_id)'
);

select throws_ok(
  'select private.is_profile_active()',
  null,
  null,
  '21. authenticated no invoca helpers privados (is_profile_active)'
);

-- ============================================================================
-- TEST CASE 6: token_hash en tenant_invitations oculto a authenticated
-- ============================================================================

select throws_ok(
  'select token_hash from public.tenant_invitations',
  null,
  null,
  '22. authenticated no puede leer la columna token_hash en tenant_invitations (permiso denegado)'
);

select lives_ok(
  'select id, tenant_id, normalized_email, status from public.tenant_invitations',
  '23. authenticated puede leer exclusivamente columnas seguras de tenant_invitations'
);

-- ============================================================================
-- TEST CASE 7: set_active_tenant rechaza tenant ajeno y suspendido
-- ============================================================================

select throws_ok(
  'select public.set_active_tenant((select tenant_b from _test_ids))',
  null,
  null,
  '24. set_active_tenant rechaza tenant ajeno o donde no es miembro activo'
);

-- Suspend Tenant A via service_role inside DO block and check set_active_tenant refusal
reset role;
do $$
begin
  perform public.suspend_tenant('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', (select tenant_a from _test_ids));
end;
$$;

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select throws_ok(
  'select public.set_active_tenant((select tenant_a from _test_ids))',
  null,
  null,
  '25. set_active_tenant rechaza tenant suspendido'
);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '26. Tenant suspendido obtiene cero acceso (filas ocultadas)'
);

-- Reactivate Tenant A and restore active context for remaining tests inside DO block
reset role;
do $$
begin
  perform public.activate_tenant('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', (select tenant_a from _test_ids));
end;
$$;
update public.user_tenant_context set active_tenant_id = (select tenant_a from _test_ids) where user_id = '11111111-1111-1111-1111-111111111111'::uuid;

-- ============================================================================
-- TEST CASE 8: Perfil suspendido y membresía revocada obtienen cero acceso
-- ============================================================================

-- Suspend Bob's profile
update public.profiles set status = 'suspended'::public.profile_status where id = '22222222-2222-2222-2222-222222222222'::uuid;

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '22222222-2222-2222-2222-222222222222')::text, true);
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '27. Perfil suspendido obtiene cero acceso al tenant'
);

-- Restore Bob's profile
reset role;
update public.profiles set status = 'active'::public.profile_status where id = '22222222-2222-2222-2222-222222222222'::uuid;
update public.user_tenant_context set active_tenant_id = (select tenant_b from _test_ids) where user_id = '22222222-2222-2222-2222-222222222222'::uuid;

-- Revoke Charlie's membership inside DO block
do $$
begin
  perform public.revoke_tenant_membership('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', (select tenant_a from _test_ids), '33333333-3333-3333-3333-333333333333'::uuid);
end;
$$;
insert into public.user_tenant_context (user_id, active_tenant_id) values ('33333333-3333-3333-3333-333333333333'::uuid, (select tenant_a from _test_ids)) on conflict (user_id) do update set active_tenant_id = excluded.active_tenant_id;

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '33333333-3333-3333-3333-333333333333')::text, true);
select set_config('request.jwt.claim.sub', '33333333-3333-3333-3333-333333333333', true);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '28. Membresía revocada obtiene cero acceso (incluso si active_tenant_id apuntara a ella)'
);

-- ============================================================================
-- TEST CASE 9: Email confirmado requerido & Protección contra replay
-- ============================================================================

-- Switch to Eve (unconfirmed email in auth.users)
select set_config('request.jwt.claims', json_build_object('sub', '55555555-5555-5555-5555-555555555555')::text, true);
select set_config('request.jwt.claim.sub', '55555555-5555-5555-5555-555555555555', true);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_eve_token from _test_ids))',
  null,
  null,
  '29. Una cuenta sin email confirmado (email_confirmed_at null) no puede aceptar una invitación'
);

-- Switch to Dave (who has confirmed email and multiple test tokens)
select set_config('request.jwt.claims', json_build_object('sub', '44444444-4444-4444-4444-444444444444')::text, true);
select set_config('request.jwt.claim.sub', '44444444-4444-4444-4444-444444444444', true);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_exp_token from _test_ids))',
  null,
  null,
  '30. Invitación vencida por expires_at falla'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_rev_token from _test_ids))',
  null,
  null,
  '31. Invitación revocada falla'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_other_token from _test_ids))',
  null,
  null,
  '32. Invitación con email diferente al autenticado falla'
);

select lives_ok(
  'select public.accept_tenant_invitation((select inv_token from _test_ids))',
  '33. Invitación válida de cuenta con email confirmado se acepta felizmente por primera vez'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_token from _test_ids))',
  null,
  null,
  '34. Invitación válida ya aceptada falla al intentar consumirse de nuevo (replay protection)'
);

-- ============================================================================
-- TEST CASE 10: No almacenamiento de tokens planos y audit_events append-only
-- ============================================================================

reset role;

select is(
  (select count(*)::integer from public.tenant_invitations where token_hash in (select inv_token from _test_ids)),
  0,
  '35. El token plano jamás es almacenado en la tabla (únicamente su hash sha256)'
);

select throws_ok(
  'delete from public.audit_events',
  null,
  null,
  '36. audit_events no admite DELETE (ni siquiera desde superuser / service_role por trigger)'
);

select throws_ok(
  'update public.audit_events set correlation_id = ''altered'' where id = (select id from public.audit_events limit 1)',
  null,
  null,
  '37. audit_events no admite UPDATE (inmutable de por vida)'
);

select ok(
  (select count(*)::integer > 0 from public.audit_events where action_type = 'invitation_accepted'),
  '38. Auditoría transaccional registró correctamente el evento de aceptación de invitación'
);

-- ============================================================================
-- TEST CASE 11: Seguridad search_path y ausencias de recursión en joins
-- ============================================================================

select set_config('search_path', 'extensions, pg_temp', false);

select lives_ok(
  'select public.create_tenant_with_defaults(''11111111-1111-1111-1111-111111111111''::uuid, ''alice@transport.dev'', ''secure-slug'', ''Secure Legal'', ''Secure Display'')',
  '39. RPCs con search_path='''' ignoran manipulación maliciosa del search_path del cliente'
);

select set_config('search_path', 'public, extensions', false);

-- Switch back to Alice and verify multi-table join does not produce infinite RLS recursion
select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select lives_ok(
  'select count(*) from public.tenants t join public.tenant_memberships m on m.tenant_id = t.id join public.tenant_branding b on b.tenant_id = t.id where t.id = (select tenant_a from _test_ids)',
  '40. Consultas conjuntas sobre tablas del dominio se resuelven sin recursión ni ciclos infinitos de RLS'
);

reset role;

select throws_ok(
  'delete from public.tenants where id = (select tenant_a from _test_ids)',
  null,
  null,
  '41. No existe hard delete de tenants operable debido a restricciones ON DELETE RESTRICT'
);

select ok(
  (select count(*)::integer = 0 from public.system_modules),
  '42. system_modules está vacío sin filas inventadas prematuramente'
);

-- ============================================================================
-- TEST CASE 12: Hardening de asset paths y slug del tenant
-- ============================================================================

select throws_ok(
  'update public.tenant_branding set logo_asset_path = ''http://evil.com/logo.png'' where tenant_id = (select tenant_a from _test_ids)',
  null,
  null,
  '43. Rutas absolutas HTTP/HTTPS en asset paths son rechazadas por constraint'
);

select throws_ok(
  'update public.tenant_branding set favicon_asset_path = ''../etc/passwd'' where tenant_id = (select tenant_a from _test_ids)',
  null,
  null,
  '44. Rutas con directory traversal (..) en asset paths son rechazadas'
);

select lives_ok(
  'update public.tenant_branding set logo_asset_path = ''tenants/logos/logo.png'' where tenant_id = (select tenant_a from _test_ids)',
  '45. Rutas relativas de Storage válidas en asset paths son aceptadas'
);

select throws_ok(
  'insert into public.tenants (slug, legal_name, display_name) values (''invalid--slug'', ''Bad Legal'', ''Bad Display'')',
  null,
  null,
  '46. Tenant slug con guiones consecutivos es rechazado por constraint robusta'
);

select throws_ok(
  'insert into public.tenants (slug, legal_name, display_name) values (''Invalid Slug'', ''Bad Legal'', ''Bad Display'')',
  null,
  null,
  '47. Tenant slug con mayúsculas y espacios es rechazado por constraint robusta'
);

select lives_ok(
  'insert into public.tenants (slug, legal_name, display_name) values (''valid-slug-99'', ''Valid Legal'', ''Valid Display'')',
  '48. Tenant slug válido en minúsculas y sin guiones consecutivos es aceptado felizmente'
);

select * from finish();

rollback;
