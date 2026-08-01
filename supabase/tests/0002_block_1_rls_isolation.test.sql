-- Block 1 RLS & Isolation Verification Test Suite — Transport Platform V2 (pgTAP)
-- Verifies zero access for anon/inactive/unscoped users, tenant isolation, DML denial, and secure RPCs.
-- All tests run inside a single transaction and terminate with ROLLBACK to leave zero persisted fixtures.

begin;

select plan(34);

-- ============================================================================
-- SETUP FIXTURES AS SERVICE_ROLE / SUPERUSER (Within transaction)
-- ============================================================================

-- Create test identities in auth.users (triggers profile creation via private.sync_user_profile)
insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111'::uuid, 'alice@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'bob@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'charlie@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'dave@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

-- Verify profile creation
select is(
  (select email from public.profiles where id = '11111111-1111-1111-1111-111111111111'::uuid),
  'alice@transport.dev',
  '1. Profile automatically created and synchronized on auth.users insert'
);

-- Create Tenants via service-role RPC
create temporary table _test_ids (
  tenant_a uuid,
  tenant_b uuid,
  tenant_c uuid,
  inv_token text,
  inv_exp_token text,
  inv_rev_token text,
  inv_other_token text
);

insert into _test_ids (tenant_a, tenant_b, tenant_c)
values (
  public.create_tenant_with_defaults('tenant-a', 'Tenant A Legal S.A.', 'Tenant A Express', 'UTC', 'es-CL', 'active'::public.tenant_status),
  public.create_tenant_with_defaults('tenant-b', 'Tenant B Legal S.A.', 'Tenant B Logistics', 'UTC', 'es-CL', 'active'::public.tenant_status),
  public.create_tenant_with_defaults('tenant-c', 'Tenant C Legal S.A.', 'Tenant C Cargo', 'UTC', 'es-CL', 'draft'::public.tenant_status)
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

-- Generate invitation tokens for Dave
do $$
declare
  v_a uuid;
  v_b uuid;
  v_token text;
  v_exp_token text;
  v_rev_token text;
  v_other text;
  v_rev_id uuid;
begin
  select tenant_a, tenant_b into v_a, v_b from _test_ids;
  
  v_token := public.create_tenant_invitation(v_b, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, '22222222-2222-2222-2222-222222222222'::uuid, 72);
  v_exp_token := public.create_tenant_invitation(v_a, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, '11111111-1111-1111-1111-111111111111'::uuid, 72);
  v_rev_token := public.create_tenant_invitation(v_a, 'dave@transport.dev', 'tenant_admin'::public.tenant_role, '11111111-1111-1111-1111-111111111111'::uuid, 72);
  v_other := public.create_tenant_invitation(v_a, 'someoneelse@transport.dev', 'tenant_admin'::public.tenant_role, '11111111-1111-1111-1111-111111111111'::uuid, 72);
  
  -- Force expire v_exp_token
  update public.tenant_invitations set expires_at = now() - interval '2 hours' where token_hash = encode(extensions.digest(v_exp_token, 'sha256'), 'hex');
  
  -- Revoke v_rev_token via RPC
  select id into v_rev_id from public.tenant_invitations where token_hash = encode(extensions.digest(v_rev_token, 'sha256'), 'hex');
  perform public.revoke_tenant_invitation(v_rev_id);
  
  update _test_ids set inv_token = v_token, inv_exp_token = v_exp_token, inv_rev_token = v_rev_token, inv_other_token = v_other;
end;
$$;

-- ============================================================================
-- TEST CASE 1: Anónimos obtienen cero acceso
-- ============================================================================

set role anon;

select throws_ok(
  'select * from public.tenants',
  null,
  null,
  '2. Anónimos obtienen cero acceso (permiso denegado por defecto en tenants)'
);

select throws_ok(
  'select * from public.profiles',
  null,
  null,
  '3. Anónimos obtienen cero acceso a perfiles'
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
  '4. Usuario autenticado sin tenant activo obtiene cero filas en tenants'
);

select is(
  (select count(*)::integer from public.tenant_branding),
  0,
  '5. Usuario autenticado sin tenant activo obtiene cero filas en branding'
);

-- ============================================================================
-- TEST CASE 3: Tenant A no lee ni modifica Tenant B (Aislamiento Multi-Tenant)
-- ============================================================================

-- Switch to Alice (Tenant A Admin)
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select is(
  (select count(*)::integer from public.tenants where id = (select tenant_a from _test_ids)),
  1,
  '6. Tenant A lee su propio tenant activo'
);

select is(
  (select count(*)::integer from public.tenants where id = (select tenant_b from _test_ids)),
  0,
  '7. Tenant A no lee Tenant B'
);

select throws_ok(
  'update public.tenants set display_name = ''Hacked'' where id = (select tenant_b from _test_ids)',
  null,
  null,
  '8. Tenant A no modifica Tenant B (Ni si quiera su propio tenant: DML directo prohibido)'
);

-- ============================================================================
-- TEST CASE 4: DML directo denegado en tablas sensibles para authenticated
-- ============================================================================

select throws_ok(
  'delete from public.profiles where id = ''11111111-1111-1111-1111-111111111111''',
  null,
  null,
  '9. DML directo (DELETE) denegado en profiles'
);

select throws_ok(
  'insert into public.tenant_memberships (tenant_id, user_id) values ((select tenant_a from _test_ids), ''44444444-4444-4444-4444-444444444444'')',
  null,
  null,
  '10. DML directo (INSERT) denegado en tenant_memberships'
);

select throws_ok(
  'insert into public.audit_events (action_type, entity_type) values (''tenant_created'', ''tenant'')',
  null,
  null,
  '11. DML directo (INSERT) denegado en audit_events'
);

select throws_ok(
  'select * from public.audit_events',
  null,
  null,
  '12. SELECT denegado a authenticated en audit_events en PR 1'
);

-- ============================================================================
-- TEST CASE 5: Prohibida la invocación de RPCs service-role-only y helpers privados
-- ============================================================================

select throws_ok(
  'select public.activate_tenant((select tenant_a from _test_ids))',
  null,
  null,
  '13. authenticated no invoca RPCs service-role-only (activate_tenant)'
);

select throws_ok(
  'select public.create_tenant_with_defaults(''hacked'', ''Hacked'', ''Hacked'')',
  null,
  null,
  '14. authenticated no invoca RPCs service-role-only (create_tenant_with_defaults)'
);

select throws_ok(
  'select private.current_active_tenant_id()',
  null,
  null,
  '15. authenticated no invoca helpers privados (current_active_tenant_id)'
);

select throws_ok(
  'select private.is_profile_active()',
  null,
  null,
  '16. authenticated no invoca helpers privados (is_profile_active)'
);

-- ============================================================================
-- TEST CASE 6: set_active_tenant rechaza tenant ajeno y suspendido
-- ============================================================================

select throws_ok(
  'select public.set_active_tenant((select tenant_b from _test_ids))',
  null,
  null,
  '17. set_active_tenant rechaza tenant ajeno o donde no es miembro activo'
);

-- Suspend Tenant A via service_role and check set_active_tenant refusal
reset role;
select public.suspend_tenant((select tenant_a from _test_ids));

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select throws_ok(
  'select public.set_active_tenant((select tenant_a from _test_ids))',
  null,
  null,
  '18. set_active_tenant rechaza tenant suspendido'
);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '19. Tenant suspendido obtiene cero acceso (filas ocultadas)'
);

-- Reactivate Tenant A and restore active context for remaining tests
reset role;
select public.activate_tenant((select tenant_a from _test_ids));
update public.user_tenant_context set active_tenant_id = (select tenant_a from _test_ids) where user_id = '11111111-1111-1111-1111-111111111111'::uuid;

-- ============================================================================
-- TEST CASE 7: Perfil suspendido y membresía revocada obtienen cero acceso
-- ============================================================================

-- Suspend Bob's profile
update public.profiles set status = 'suspended'::public.profile_status where id = '22222222-2222-2222-2222-222222222222'::uuid;

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '22222222-2222-2222-2222-222222222222')::text, true);
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '20. Perfil suspendido obtiene cero acceso al tenant'
);

-- Restore Bob's profile
reset role;
update public.profiles set status = 'active'::public.profile_status where id = '22222222-2222-2222-2222-222222222222'::uuid;
update public.user_tenant_context set active_tenant_id = (select tenant_b from _test_ids) where user_id = '22222222-2222-2222-2222-222222222222'::uuid;

-- Revoke Charlie's membership
select public.revoke_tenant_membership((select tenant_a from _test_ids), '33333333-3333-3333-3333-333333333333'::uuid);
insert into public.user_tenant_context (user_id, active_tenant_id) values ('33333333-3333-3333-3333-333333333333'::uuid, (select tenant_a from _test_ids)) on conflict (user_id) do update set active_tenant_id = excluded.active_tenant_id;

select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '33333333-3333-3333-3333-333333333333')::text, true);
select set_config('request.jwt.claim.sub', '33333333-3333-3333-3333-333333333333', true);

select is(
  (select count(*)::integer from public.tenants),
  0,
  '21. Membresía revocada obtiene cero acceso (incluso si active_tenant_id apuntara a ella)'
);

-- ============================================================================
-- TEST CASE 8: Invitaciones transaccionales y protección contra replay
-- ============================================================================

-- Switch to Dave (who has multiple test invitation tokens)
select set_config('request.jwt.claims', json_build_object('sub', '44444444-4444-4444-4444-444444444444')::text, true);
select set_config('request.jwt.claim.sub', '44444444-4444-4444-4444-444444444444', true);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_exp_token from _test_ids))',
  null,
  null,
  '22. Invitación vencida por expires_at falla'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_rev_token from _test_ids))',
  null,
  null,
  '23. Invitación revocada falla'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_other_token from _test_ids))',
  null,
  null,
  '24. Invitación con email diferente al autenticado falla'
);

select lives_ok(
  'select public.accept_tenant_invitation((select inv_token from _test_ids))',
  '25. Invitación válida se acepta felizmente por primera vez'
);

select throws_ok(
  'select public.accept_tenant_invitation((select inv_token from _test_ids))',
  null,
  null,
  '26. Invitación válida ya aceptada falla al intentar consumirse de nuevo (replay protection)'
);

-- ============================================================================
-- TEST CASE 9: No almacenamiento de tokens planos en base de datos
-- ============================================================================

reset role;

select is(
  (select count(*)::integer from public.tenant_invitations where token_hash in (select inv_token from _test_ids)),
  0,
  '27. El token plano jamás es almacenado en la tabla (únicamente su hash sha256)'
);

-- ============================================================================
-- TEST CASE 10: audit_events append-only estricto
-- ============================================================================

select throws_ok(
  'delete from public.audit_events',
  null,
  null,
  '28. audit_events no admite DELETE (ni siquiera desde superuser / service_role por trigger)'
);

select throws_ok(
  'update public.audit_events set correlation_id = ''altered'' where id = (select id from public.audit_events limit 1)',
  null,
  null,
  '29. audit_events no admite UPDATE (inmutable de por vida)'
);

select ok(
  (select count(*)::integer > 0 from public.audit_events where action_type = 'invitation_accepted'),
  '30. Auditoría transaccional registró correctamente el evento de aceptación de invitación'
);

-- ============================================================================
-- TEST CASE 11: Protección de resolución ante search_path malicioso
-- ============================================================================

select set_config('search_path', 'extensions, pg_temp', false);

select lives_ok(
  'select public.create_tenant_with_defaults(''secure-slug'', ''Secure Legal'', ''Secure Display'')',
  '31. RPCs con search_path='''' y nombres cualificados ignoran manipulación maliciosa del search_path del cliente'
);

select set_config('search_path', 'public, extensions', false);

-- ============================================================================
-- TEST CASE 12: Ausencia de recursión y prevención de hard deletes
-- ============================================================================

-- Switch back to Alice and verify multi-table join does not produce infinite RLS recursion
select set_config('role', 'authenticated', true);
select set_config('request.jwt.claims', json_build_object('sub', '11111111-1111-1111-1111-111111111111')::text, true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

select lives_ok(
  'select count(*) from public.tenants t join public.tenant_memberships m on m.tenant_id = t.id join public.tenant_branding b on b.tenant_id = t.id where t.id = (select tenant_a from _test_ids)',
  '32. Consultas conjuntas sobre tablas del dominio se resuelven sin recursión ni ciclos infinitos de RLS'
);

reset role;

select throws_ok(
  'delete from public.tenants where id = (select tenant_a from _test_ids)',
  null,
  null,
  '33. No existe hard delete de tenants operable debido a restricciones ON DELETE RESTRICT'
);

select ok(
  (select count(*)::integer = 0 from public.system_modules),
  '34. system_modules está vacío sin filas inventadas prematuramente'
);

select * from finish();

rollback;
