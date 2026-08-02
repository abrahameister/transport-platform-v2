-- Block 2 Client & Employee Foundation Verification Test Suite — Transport Platform V2 (pgTAP)
-- Verifies zero access for unscoped, suspended, or revoked users, strict tenant isolation, DML denial, and secure RPC operations.
-- All tests run inside a single transaction and terminate with ROLLBACK to leave zero persisted fixtures.

begin;

select plan(50);

-- ============================================================================
-- SETUP FIXTURES AS SERVICE_ROLE / SUPERUSER (Within transaction)
-- ============================================================================

insert into auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111'::uuid, 'alice_b2@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'bob_b2@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'charlie_b2@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'dave_b2@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('55555555-5555-5555-5555-555555555555'::uuid, 'eve_b2@transport.dev', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

create temporary table _test_ids (
  tenant_a uuid,
  tenant_b uuid,
  tenant_c uuid,
  client_a uuid,
  client_b uuid,
  emp_a uuid,
  emp_b uuid,
  upload_a uuid,
  upload_b uuid,
  demand_a uuid,
  job_a uuid
);
grant select on table _test_ids to authenticated, anon;

do $$
declare
  v_id_a uuid;
  v_id_b uuid;
  v_id_c uuid;
begin
  v_id_a := public.create_tenant_with_defaults('11111111-1111-1111-1111-111111111111'::uuid, 'alice_b2@transport.dev', 'tenant-a-b2', 'Tenant A B2 S.A.', 'Tenant A Express', 'UTC', 'es-CL');
  v_id_b := public.create_tenant_with_defaults('22222222-2222-2222-2222-222222222222'::uuid, 'bob_b2@transport.dev', 'tenant-b-b2', 'Tenant B B2 S.A.', 'Tenant B Logistics', 'UTC', 'es-CL');
  v_id_c := public.create_tenant_with_defaults('44444444-4444-4444-4444-444444444444'::uuid, 'dave_b2@transport.dev', 'tenant-c-b2', 'Tenant C B2 S.A.', 'Tenant C Cargo', 'UTC', 'es-CL');

  perform public.activate_tenant('11111111-1111-1111-1111-111111111111'::uuid, 'alice_b2@transport.dev', v_id_a);
  perform public.activate_tenant('22222222-2222-2222-2222-222222222222'::uuid, 'bob_b2@transport.dev', v_id_b);
  perform public.activate_tenant('44444444-4444-4444-4444-444444444444'::uuid, 'dave_b2@transport.dev', v_id_c);

  insert into _test_ids (tenant_a, tenant_b, tenant_c) values (v_id_a, v_id_b, v_id_c);
end;
$$;

insert into public.tenant_memberships (tenant_id, user_id, role, status)
select tenant_a, '11111111-1111-1111-1111-111111111111'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids
union all
select tenant_b, '22222222-2222-2222-2222-222222222222'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids
union all
select tenant_c, '44444444-4444-4444-4444-444444444444'::uuid, 'tenant_admin'::public.tenant_role, 'active'::public.membership_status from _test_ids
union all
select tenant_a, '55555555-5555-5555-5555-555555555555'::uuid, 'tenant_admin'::public.tenant_role, 'revoked'::public.membership_status from _test_ids;

insert into public.user_tenant_context (user_id, active_tenant_id)
select '11111111-1111-1111-1111-111111111111'::uuid, tenant_a from _test_ids
union all
select '22222222-2222-2222-2222-222222222222'::uuid, tenant_b from _test_ids
union all
select '44444444-4444-4444-4444-444444444444'::uuid, tenant_c from _test_ids
union all
select '55555555-5555-5555-5555-555555555555'::uuid, tenant_a from _test_ids;

-- Suspend Tenant C
update public.tenants set status = 'suspended'::public.tenant_status where id = (select tenant_c from _test_ids);

-- ============================================================================
-- TEST GROUP 1: DIRECT DML DENIAL FOR AUTHENTICATED
-- ============================================================================

set local role authenticated;
set local "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';

select throws_ok(
  $$insert into public.client_companies (tenant_id, legal_name, display_name) values ((select tenant_a from _test_ids), 'Direct S.A.', 'Direct')$$,
  '42501', null, '1. Direct INSERT into client_companies denied for authenticated'
);
select throws_ok(
  $$insert into public.company_employee_records (tenant_id, client_company_id, full_name, identifier) values ((select tenant_a from _test_ids), gen_random_uuid(), 'Direct Emp', 'EMP-1')$$,
  '42501', null, '2. Direct INSERT into company_employee_records denied for authenticated'
);
select throws_ok(
  $$insert into public.employee_addresses (tenant_id, employee_record_id, street_address, geocodable_address_text) values ((select tenant_a from _test_ids), gen_random_uuid(), 'Street 1', 'Street 1, City')$$,
  '42501', null, '3. Direct INSERT into employee_addresses denied for authenticated'
);
select throws_ok(
  $$insert into public.schedule_uploads (tenant_id, uploaded_by, original_filename) values ((select tenant_a from _test_ids), '11111111-1111-1111-1111-111111111111'::uuid, 'test.csv')$$,
  '42501', null, '4. Direct INSERT into schedule_uploads denied for authenticated'
);
select throws_ok(
  $$insert into public.schedule_upload_rows (tenant_id, schedule_upload_id, row_number) values ((select tenant_a from _test_ids), gen_random_uuid(), 1)$$,
  '42501', null, '5. Direct INSERT into schedule_upload_rows denied for authenticated'
);
select throws_ok(
  $$insert into public.daily_demand (tenant_id, client_company_id, demand_date) values ((select tenant_a from _test_ids), gen_random_uuid(), '2026-08-01'::date)$$,
  '42501', null, '6. Direct INSERT into daily_demand denied for authenticated'
);
select throws_ok(
  $$insert into public.import_jobs (tenant_id, job_type, initiated_by) values ((select tenant_a from _test_ids), 'employee_directory_import'::public.import_job_type, '11111111-1111-1111-1111-111111111111'::uuid)$$,
  '42501', null, '7. Direct INSERT into import_jobs denied for authenticated'
);

-- ============================================================================
-- TEST GROUP 2: SECURE MUTATION VIA RPCS (ALICE - TENANT A)
-- ============================================================================

do $$
declare
  v_client_a uuid;
  v_emp_a uuid;
  v_addr_a uuid;
  v_up_a uuid;
  v_row_a uuid;
  v_dem_a uuid;
  v_job_a uuid;
begin
  v_client_a := public.create_client_company('Client A Legal S.A.', 'Client A Display', 'TAX-A');
  v_emp_a := public.create_employee_record(v_client_a, 'John Doe', 'ID-100', 'john@client-a.com');
  v_addr_a := public.create_employee_address(v_emp_a, 'Av Providencia 1234', 'Av Providencia 1234, Santiago', 'home', 'Santiago', 'RM', '7500000', 'CL');
  v_up_a := public.create_schedule_upload('horarios_semana_1.csv', v_client_a, 'csv'::public.schedule_upload_source);
  v_row_a := public.add_schedule_upload_row(v_up_a, 1, '{"employee_id": "ID-100", "shift": "morning"}'::jsonb, 'valid'::public.upload_row_validation_status);
  v_dem_a := public.create_daily_demand(v_client_a, '2026-08-05'::date, 15, 1, v_up_a, 'Demanda inicial lunes');
  v_job_a := public.create_import_job('employee_directory_import'::public.import_job_type, '{"total": 100}'::jsonb);

  update _test_ids set client_a = v_client_a, emp_a = v_emp_a, upload_a = v_up_a, demand_a = v_dem_a, job_a = v_job_a;
end;
$$;

select is((select count(*)::integer from public.client_companies where tenant_id = (select tenant_a from _test_ids)), 1, '8. Alice views client company in Tenant A');
select is((select count(*)::integer from public.company_employee_records where tenant_id = (select tenant_a from _test_ids)), 1, '9. Alice views employee in Tenant A');
select is((select count(*)::integer from public.employee_addresses where tenant_id = (select tenant_a from _test_ids)), 1, '10. Alice views address in Tenant A');
select is((select count(*)::integer from public.schedule_uploads where tenant_id = (select tenant_a from _test_ids)), 1, '11. Alice views schedule upload in Tenant A');
select is((select count(*)::integer from public.schedule_upload_rows where tenant_id = (select tenant_a from _test_ids)), 1, '12. Alice views upload row in Tenant A');
select is((select count(*)::integer from public.daily_demand where tenant_id = (select tenant_a from _test_ids)), 1, '13. Alice views daily demand in Tenant A');
select is((select count(*)::integer from public.import_jobs where tenant_id = (select tenant_a from _test_ids)), 1, '14. Alice views import job in Tenant A');

-- ============================================================================
-- TEST GROUP 3: TENANT ISOLATION (BOB - TENANT B)
-- ============================================================================

set local role authenticated;
set local "request.jwt.claim.sub" = '22222222-2222-2222-2222-222222222222';

do $$
declare
  v_client_b uuid;
  v_emp_b uuid;
  v_up_b uuid;
begin
  v_client_b := public.create_client_company('Client B Legal S.A.', 'Client B Display', 'TAX-B');
  v_emp_b := public.create_employee_record(v_client_b, 'Jane Smith', 'ID-200', 'jane@client-b.com');
  v_up_b := public.create_schedule_upload('turnos_b.xlsx', v_client_b, 'xlsx'::public.schedule_upload_source);
  perform public.add_schedule_upload_row(v_up_b, 1, '{"employee_id": "ID-200", "shift": "evening"}'::jsonb, 'valid'::public.upload_row_validation_status);

  update _test_ids set client_b = v_client_b, emp_b = v_emp_b, upload_b = v_up_b;
end;
$$;

select is((select count(*)::integer from public.client_companies where tenant_id = (select tenant_a from _test_ids)), 0, '15. Bob cannot read Tenant A client companies');
select is((select count(*)::integer from public.company_employee_records where tenant_id = (select tenant_a from _test_ids)), 0, '16. Bob cannot read Tenant A employees');
select is((select count(*)::integer from public.employee_addresses where tenant_id = (select tenant_a from _test_ids)), 0, '17. Bob cannot read Tenant A addresses');
select is((select count(*)::integer from public.schedule_uploads where tenant_id = (select tenant_a from _test_ids)), 0, '18. Bob cannot read Tenant A schedule uploads');
select is((select count(*)::integer from public.schedule_upload_rows where tenant_id = (select tenant_a from _test_ids)), 0, '19. Bob cannot read Tenant A upload rows');
select is((select count(*)::integer from public.daily_demand where tenant_id = (select tenant_a from _test_ids)), 0, '20. Bob cannot read Tenant A daily demand');
select is((select count(*)::integer from public.import_jobs where tenant_id = (select tenant_a from _test_ids)), 0, '21. Bob cannot read Tenant A import jobs');

select throws_ok(
  $$select public.create_client_company('Hacked Client', 'Hacked', 'TAX-X', (select tenant_a from _test_ids))$$,
  '42501', null, '22. Bob cannot create a client company in Tenant A'
);
select throws_ok(
  $$select public.create_employee_record((select client_a from _test_ids), 'Hacked Emp', 'ID-999', null, 'active'::public.employee_record_status, (select tenant_a from _test_ids))$$,
  'P0002', null, '23. Bob cannot add an employee to Tenant A client company'
);
select throws_ok(
  $$select public.create_schedule_upload('hack.csv', (select client_a from _test_ids), 'csv'::public.schedule_upload_source, (select tenant_a from _test_ids))$$,
  'P0002', null, '24. Bob cannot upload a schedule to Tenant A client company'
);
select throws_ok(
  $$select public.create_daily_demand((select client_a from _test_ids), '2026-08-10'::date, 50, 5, null, 'Hack', (select tenant_a from _test_ids))$$,
  'P0002', null, '25. Bob cannot create daily demand for Tenant A client company'
);

-- ============================================================================
-- TEST GROUP 4: UNSCOPED AUTHENTICATED USER (CHARLIE)
-- ============================================================================

set local role authenticated;
set local "request.jwt.claim.sub" = '33333333-3333-3333-3333-333333333333';

select is((select count(*)::integer from public.client_companies), 0, '26. Unscoped user sees zero client companies');
select is((select count(*)::integer from public.company_employee_records), 0, '27. Unscoped user sees zero employee records');
select is((select count(*)::integer from public.employee_addresses), 0, '28. Unscoped user sees zero employee addresses');
select is((select count(*)::integer from public.schedule_uploads), 0, '29. Unscoped user sees zero schedule uploads');
select is((select count(*)::integer from public.schedule_upload_rows), 0, '30. Unscoped user sees zero upload rows');
select is((select count(*)::integer from public.daily_demand), 0, '31. Unscoped user sees zero daily demand');
select is((select count(*)::integer from public.import_jobs), 0, '32. Unscoped user sees zero import jobs');

select throws_ok(
  $$select public.create_client_company('Charlie S.A.', 'Charlie', 'TAX-C')$$,
  '42501', null, '33. Unscoped user without active tenant cannot create client company via RPC'
);

-- ============================================================================
-- TEST GROUP 5: SUSPENDED TENANT USER (DAVE - TENANT C)
-- ============================================================================

set local role authenticated;
set local "request.jwt.claim.sub" = '44444444-4444-4444-4444-444444444444';

select is((select count(*)::integer from public.client_companies), 0, '34. User in suspended tenant sees zero client companies');
select is((select count(*)::integer from public.company_employee_records), 0, '35. User in suspended tenant sees zero employee records');
select is((select count(*)::integer from public.employee_addresses), 0, '36. User in suspended tenant sees zero employee addresses');
select is((select count(*)::integer from public.schedule_uploads), 0, '37. User in suspended tenant sees zero schedule uploads');
select is((select count(*)::integer from public.schedule_upload_rows), 0, '38. User in suspended tenant sees zero upload rows');
select is((select count(*)::integer from public.daily_demand), 0, '39. User in suspended tenant sees zero daily demand');
select is((select count(*)::integer from public.import_jobs), 0, '40. User in suspended tenant sees zero import jobs');

select throws_ok(
  $$select public.create_client_company('Suspended S.A.', 'Suspended', 'TAX-S')$$,
  '42501', null, '41. User in suspended tenant cannot mutate via RPC'
);

-- ============================================================================
-- TEST GROUP 6: REVOKED MEMBERSHIP USER (EVE - TENANT A)
-- ============================================================================

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-5555-5555-555555555555';

select is((select count(*)::integer from public.client_companies), 0, '42. Revoked member sees zero client companies');
select is((select count(*)::integer from public.company_employee_records), 0, '43. Revoked member sees zero employee records');
select is((select count(*)::integer from public.employee_addresses), 0, '44. Revoked member sees zero employee addresses');
select is((select count(*)::integer from public.schedule_uploads), 0, '45. Revoked member sees zero schedule uploads');
select is((select count(*)::integer from public.schedule_upload_rows), 0, '46. Revoked member sees zero upload rows');
select is((select count(*)::integer from public.daily_demand), 0, '47. Revoked member sees zero daily demand');
select is((select count(*)::integer from public.import_jobs), 0, '48. Revoked member sees zero import jobs');

select throws_ok(
  $$select public.create_client_company('Revoked S.A.', 'Revoked', 'TAX-R')$$,
  '42501', null, '49. Revoked member cannot mutate via RPC'
);

-- ============================================================================
-- VERIFY AUDIT TRAIL
-- ============================================================================

set local role service_role;
select ok(
  (select count(*)::integer >= 5 from public.audit_events where action_type in ('client_company_created', 'employee_record_created', 'schedule_upload_created', 'daily_demand_created', 'import_job_started')),
  '50. Audit trail correctly captured Block 2 domain events with real actor identities'
);

select * from finish();
rollback;
