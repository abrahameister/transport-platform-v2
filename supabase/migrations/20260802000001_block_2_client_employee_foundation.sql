-- Migration 10: Block 2 Client & Employee Foundation — Transport Platform V2
-- Defines core domain tables for client companies, employees, schedule uploads, and daily demand.
-- Establishes fail-closed RLS policies and secure RPCs for import operations without exposing DML to authenticated clients.

-- Extend audit types for Block 2 domain events and entities
alter type public.audit_action_type add value if not exists 'client_company_created';
alter type public.audit_action_type add value if not exists 'employee_record_created';
alter type public.audit_action_type add value if not exists 'employee_address_created';
alter type public.audit_action_type add value if not exists 'schedule_upload_created';
alter type public.audit_action_type add value if not exists 'schedule_upload_row_created';
alter type public.audit_action_type add value if not exists 'daily_demand_created';
alter type public.audit_action_type add value if not exists 'import_job_started';
alter type public.audit_action_type add value if not exists 'import_job_finished';

alter type public.audit_entity_type add value if not exists 'client_company';
alter type public.audit_entity_type add value if not exists 'company_employee_record';
alter type public.audit_entity_type add value if not exists 'employee_address';
alter type public.audit_entity_type add value if not exists 'schedule_upload';
alter type public.audit_entity_type add value if not exists 'schedule_upload_row';
alter type public.audit_entity_type add value if not exists 'daily_demand';
alter type public.audit_entity_type add value if not exists 'import_job';

-- Block 2 Domain Enums
create type public.client_company_status as enum ('active', 'inactive', 'archived');
create type public.employee_record_status as enum ('active', 'inactive', 'on_leave', 'terminated');
create type public.schedule_upload_source as enum ('csv', 'xlsx', 'api', 'manual');
create type public.schedule_upload_status as enum ('pending', 'processing', 'validated', 'partially_valid', 'error', 'completed');
create type public.upload_row_validation_status as enum ('pending', 'valid', 'error');
create type public.daily_demand_status as enum ('open', 'locked', 'processing', 'completed', 'cancelled');
create type public.import_job_type as enum ('employee_directory_import', 'schedule_demand_import', 'client_company_import');
create type public.import_job_status as enum ('queued', 'running', 'completed', 'failed', 'cancelled');

-- A. public.client_companies
create table public.client_companies (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  legal_name text not null check (char_length(trim(legal_name)) > 0),
  display_name text not null check (char_length(trim(display_name)) > 0),
  tax_id text,
  status public.client_company_status not null default 'active'::public.client_company_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint uk_client_companies_tenant_legal_name unique (tenant_id, legal_name)
);

create index idx_client_companies_tenant_status on public.client_companies(tenant_id, status);

create trigger update_client_companies_updated_at
  before update on public.client_companies
  for each row execute function private.update_updated_at_column();

-- B. public.company_employee_records
create table public.company_employee_records (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  client_company_id uuid not null references public.client_companies(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) > 0),
  email text check (email is null or (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' and email = lower(trim(email)))),
  identifier text not null check (char_length(trim(identifier)) > 0),
  status public.employee_record_status not null default 'active'::public.employee_record_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uk_company_employee_records_identifier unique (tenant_id, client_company_id, identifier)
);

create index idx_company_employee_records_tenant_client on public.company_employee_records(tenant_id, client_company_id);
create index idx_company_employee_records_email on public.company_employee_records(tenant_id, email) where email is not null;

create trigger update_company_employee_records_updated_at
  before update on public.company_employee_records
  for each row execute function private.update_updated_at_column();

-- C. public.employee_addresses
create table public.employee_addresses (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  employee_record_id uuid not null references public.company_employee_records(id) on delete cascade,
  address_label text not null default 'home',
  street_address text not null check (char_length(trim(street_address)) > 0),
  city text,
  state_province text,
  postal_code text,
  country text not null default 'CL',
  geocodable_address_text text not null check (char_length(trim(geocodable_address_text)) > 0),
  latitude double precision check (latitude is null or (latitude >= -90.0 and latitude <= 90.0)),
  longitude double precision check (longitude is null or (longitude >= -180.0 and longitude <= 180.0)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_employee_addresses_tenant_employee on public.employee_addresses(tenant_id, employee_record_id);

create trigger update_employee_addresses_updated_at
  before update on public.employee_addresses
  for each row execute function private.update_updated_at_column();

-- D. public.schedule_uploads
create table public.schedule_uploads (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  client_company_id uuid references public.client_companies(id) on delete set null,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  source_type public.schedule_upload_source not null default 'csv'::public.schedule_upload_source,
  status public.schedule_upload_status not null default 'pending'::public.schedule_upload_status,
  original_filename text not null check (char_length(trim(original_filename)) > 0),
  total_rows_count integer not null default 0 check (total_rows_count >= 0),
  valid_rows_count integer not null default 0 check (valid_rows_count >= 0),
  error_rows_count integer not null default 0 check (error_rows_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_schedule_uploads_tenant_client on public.schedule_uploads(tenant_id, client_company_id, status);

create trigger update_schedule_uploads_updated_at
  before update on public.schedule_uploads
  for each row execute function private.update_updated_at_column();

-- E. public.schedule_upload_rows
create table public.schedule_upload_rows (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  schedule_upload_id uuid not null references public.schedule_uploads(id) on delete cascade,
  row_number integer not null check (row_number > 0),
  payload jsonb not null default '{}'::jsonb,
  validation_status public.upload_row_validation_status not null default 'pending'::public.upload_row_validation_status,
  validation_errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uk_schedule_upload_rows_number unique (schedule_upload_id, row_number)
);

create index idx_schedule_upload_rows_upload_status on public.schedule_upload_rows(schedule_upload_id, validation_status);

create trigger update_schedule_upload_rows_updated_at
  before update on public.schedule_upload_rows
  for each row execute function private.update_updated_at_column();

-- F. public.daily_demand
create table public.daily_demand (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  client_company_id uuid not null references public.client_companies(id) on delete cascade,
  source_schedule_upload_id uuid references public.schedule_uploads(id) on delete set null,
  demand_date date not null,
  status public.daily_demand_status not null default 'open'::public.daily_demand_status,
  total_passengers_expected integer not null default 0 check (total_passengers_expected >= 0),
  total_shifts_count integer not null default 0 check (total_shifts_count >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uk_daily_demand_tenant_client_date_source unique (tenant_id, client_company_id, demand_date, source_schedule_upload_id)
);

create index idx_daily_demand_tenant_client_date on public.daily_demand(tenant_id, client_company_id, demand_date);

create trigger update_daily_demand_updated_at
  before update on public.daily_demand
  for each row execute function private.update_updated_at_column();

-- G. public.import_jobs
create table public.import_jobs (
  id uuid not null primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  job_type public.import_job_type not null,
  status public.import_job_status not null default 'queued'::public.import_job_status,
  initiated_by uuid not null references public.profiles(id) on delete restrict,
  started_at timestamptz,
  finished_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_import_jobs_tenant_status on public.import_jobs(tenant_id, status);

create trigger update_import_jobs_updated_at
  before update on public.import_jobs
  for each row execute function private.update_updated_at_column();

-- ============================================================================
-- RLS ENABLEMENT & SECURITY GRANTS
-- ============================================================================

alter table public.client_companies enable row level security;
alter table public.company_employee_records enable row level security;
alter table public.employee_addresses enable row level security;
alter table public.schedule_uploads enable row level security;
alter table public.schedule_upload_rows enable row level security;
alter table public.daily_demand enable row level security;
alter table public.import_jobs enable row level security;

revoke all on table public.client_companies from public, anon;
revoke all on table public.company_employee_records from public, anon;
revoke all on table public.employee_addresses from public, anon;
revoke all on table public.schedule_uploads from public, anon;
revoke all on table public.schedule_upload_rows from public, anon;
revoke all on table public.daily_demand from public, anon;
revoke all on table public.import_jobs from public, anon;

grant select on table public.client_companies to authenticated;
grant select on table public.company_employee_records to authenticated;
grant select on table public.employee_addresses to authenticated;
grant select on table public.schedule_uploads to authenticated;
grant select on table public.schedule_upload_rows to authenticated;
grant select on table public.daily_demand to authenticated;
grant select on table public.import_jobs to authenticated;

grant all on table public.client_companies to service_role;
grant all on table public.company_employee_records to service_role;
grant all on table public.employee_addresses to service_role;
grant all on table public.schedule_uploads to service_role;
grant all on table public.schedule_upload_rows to service_role;
grant all on table public.daily_demand to service_role;
grant all on table public.import_jobs to service_role;

-- ============================================================================
-- PRIVATE HELPER & FAIL-CLOSED RLS POLICIES
-- ============================================================================

create or replace function private.is_active_member(p_tenant_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if p_tenant_id is null or v_user_id is null then
    return false;
  end if;
  return exists (
    select 1
    from public.tenant_memberships m
    join public.profiles p on p.id = m.user_id
    join public.tenants t on t.id = m.tenant_id
    where m.tenant_id = p_tenant_id
      and m.user_id = v_user_id
      and m.status = 'active'::public.membership_status
      and p.status = 'active'::public.profile_status
      and t.status = 'active'::public.tenant_status
  );
end;
$$;

revoke all on function private.is_active_member(uuid) from public, anon;
grant execute on function private.is_active_member(uuid) to authenticated, service_role;

create policy "Active members view client companies in active tenant"
  on public.client_companies
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view employee records in active tenant"
  on public.company_employee_records
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view employee addresses in active tenant"
  on public.employee_addresses
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view schedule uploads in active tenant"
  on public.schedule_uploads
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view schedule upload rows in active tenant"
  on public.schedule_upload_rows
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view daily demand in active tenant"
  on public.daily_demand
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

create policy "Active members view import jobs in active tenant"
  on public.import_jobs
  for select
  to authenticated
  using (
    private.is_active_member(tenant_id)
    and tenant_id in (
      select c.active_tenant_id from public.user_tenant_context c where c.user_id = auth.uid()
    )
  );

-- ============================================================================
-- SECURE MUTATION RPCS
-- ============================================================================

create or replace function public.create_client_company(
  p_legal_name text,
  p_display_name text,
  p_tax_id text default null,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_client_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  if p_tenant_id is not null then
    v_tenant_id := p_tenant_id;
  else
    select active_tenant_id into v_tenant_id from public.user_tenant_context where user_id = v_user_id;
  end if;

  if v_tenant_id is null or not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.client_companies (tenant_id, legal_name, display_name, tax_id)
  values (v_tenant_id, trim(p_legal_name), trim(p_display_name), nullif(trim(p_tax_id), ''))
  returning id into v_client_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'client_company_created'::public.audit_action_type,
    'client_company'::public.audit_entity_type, v_client_id::text,
    jsonb_build_object('legal_name', p_legal_name, 'display_name', p_display_name)
  );

  return v_client_id;
end;
$$;

revoke all on function public.create_client_company(text, text, text, uuid) from public, anon;
grant execute on function public.create_client_company(text, text, text, uuid) to authenticated, service_role;

create or replace function public.create_employee_record(
  p_client_company_id uuid,
  p_full_name text,
  p_identifier text,
  p_email text default null,
  p_status public.employee_record_status default 'active'::public.employee_record_status,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_employee_id uuid;
  v_normalized_email text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  select tenant_id into v_tenant_id from public.client_companies where id = p_client_company_id;
  if not found then
    raise exception 'Client company not found' using errcode = 'P0002';
  end if;

  if p_tenant_id is not null and p_tenant_id <> v_tenant_id then
    raise exception 'Cross-tenant violation' using errcode = '42501';
  end if;

  if not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  if p_email is not null and trim(p_email) <> '' then
    v_normalized_email := lower(trim(p_email));
  else
    v_normalized_email := null;
  end if;

  insert into public.company_employee_records (tenant_id, client_company_id, full_name, identifier, email, status)
  values (v_tenant_id, p_client_company_id, trim(p_full_name), trim(p_identifier), v_normalized_email, coalesce(p_status, 'active'::public.employee_record_status))
  returning id into v_employee_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'employee_record_created'::public.audit_action_type,
    'company_employee_record'::public.audit_entity_type, v_employee_id::text,
    jsonb_build_object('client_company_id', p_client_company_id, 'identifier', p_identifier)
  );

  return v_employee_id;
end;
$$;

revoke all on function public.create_employee_record(uuid, text, text, text, public.employee_record_status, uuid) from public, anon;
grant execute on function public.create_employee_record(uuid, text, text, text, public.employee_record_status, uuid) to authenticated, service_role;

create or replace function public.create_employee_address(
  p_employee_record_id uuid,
  p_street_address text,
  p_geocodable_address_text text,
  p_address_label text default 'home',
  p_city text default null,
  p_state_province text default null,
  p_postal_code text default null,
  p_country text default 'CL',
  p_latitude double precision default null,
  p_longitude double precision default null,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_address_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  select tenant_id into v_tenant_id from public.company_employee_records where id = p_employee_record_id;
  if not found then
    raise exception 'Employee record not found' using errcode = 'P0002';
  end if;

  if p_tenant_id is not null and p_tenant_id <> v_tenant_id then
    raise exception 'Cross-tenant violation' using errcode = '42501';
  end if;

  if not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.employee_addresses (
    tenant_id, employee_record_id, address_label, street_address, city, state_province, postal_code, country, geocodable_address_text, latitude, longitude
  )
  values (
    v_tenant_id, p_employee_record_id, coalesce(trim(p_address_label), 'home'), trim(p_street_address), nullif(trim(p_city), ''), nullif(trim(p_state_province), ''), nullif(trim(p_postal_code), ''), coalesce(trim(p_country), 'CL'), trim(p_geocodable_address_text), p_latitude, p_longitude
  )
  returning id into v_address_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'employee_address_created'::public.audit_action_type,
    'employee_address'::public.audit_entity_type, v_address_id::text,
    jsonb_build_object('employee_record_id', p_employee_record_id, 'label', p_address_label)
  );

  return v_address_id;
end;
$$;

revoke all on function public.create_employee_address(uuid, text, text, text, text, text, text, text, double precision, double precision, uuid) from public, anon;
grant execute on function public.create_employee_address(uuid, text, text, text, text, text, text, text, double precision, double precision, uuid) to authenticated, service_role;

create or replace function public.create_schedule_upload(
  p_original_filename text,
  p_client_company_id uuid default null,
  p_source_type public.schedule_upload_source default 'csv'::public.schedule_upload_source,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_upload_id uuid;
  v_client_tenant uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  if p_client_company_id is not null then
    select tenant_id into v_client_tenant from public.client_companies where id = p_client_company_id;
    if not found then
      raise exception 'Client company not found' using errcode = 'P0002';
    end if;
    v_tenant_id := v_client_tenant;
  elsif p_tenant_id is not null then
    v_tenant_id := p_tenant_id;
  else
    select active_tenant_id into v_tenant_id from public.user_tenant_context where user_id = v_user_id;
  end if;

  if p_tenant_id is not null and p_tenant_id <> v_tenant_id then
    raise exception 'Cross-tenant violation' using errcode = '42501';
  end if;

  if v_tenant_id is null or not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.schedule_uploads (
    tenant_id, client_company_id, uploaded_by, source_type, status, original_filename, total_rows_count, valid_rows_count, error_rows_count
  )
  values (
    v_tenant_id, p_client_company_id, v_user_id, coalesce(p_source_type, 'csv'::public.schedule_upload_source), 'pending'::public.schedule_upload_status, trim(p_original_filename), 0, 0, 0
  )
  returning id into v_upload_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'schedule_upload_created'::public.audit_action_type,
    'schedule_upload'::public.audit_entity_type, v_upload_id::text,
    jsonb_build_object('filename', p_original_filename, 'source_type', p_source_type)
  );

  return v_upload_id;
end;
$$;

revoke all on function public.create_schedule_upload(text, uuid, public.schedule_upload_source, uuid) from public, anon;
grant execute on function public.create_schedule_upload(text, uuid, public.schedule_upload_source, uuid) to authenticated, service_role;

create or replace function public.add_schedule_upload_row(
  p_schedule_upload_id uuid,
  p_row_number integer,
  p_payload jsonb,
  p_validation_status public.upload_row_validation_status default 'pending'::public.upload_row_validation_status,
  p_validation_errors jsonb default '[]'::jsonb,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_row_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  select tenant_id into v_tenant_id from public.schedule_uploads where id = p_schedule_upload_id;
  if not found then
    raise exception 'Schedule upload not found' using errcode = 'P0002';
  end if;

  if p_tenant_id is not null and p_tenant_id <> v_tenant_id then
    raise exception 'Cross-tenant violation' using errcode = '42501';
  end if;

  if not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.schedule_upload_rows (
    tenant_id, schedule_upload_id, row_number, payload, validation_status, validation_errors
  )
  values (
    v_tenant_id, p_schedule_upload_id, p_row_number, coalesce(p_payload, '{}'::jsonb), coalesce(p_validation_status, 'pending'::public.upload_row_validation_status), coalesce(p_validation_errors, '[]'::jsonb)
  )
  returning id into v_row_id;

  update public.schedule_uploads
  set total_rows_count = total_rows_count + 1,
      valid_rows_count = case when coalesce(p_validation_status, 'pending'::public.upload_row_validation_status) = 'valid'::public.upload_row_validation_status then valid_rows_count + 1 else valid_rows_count end,
      error_rows_count = case when coalesce(p_validation_status, 'pending'::public.upload_row_validation_status) = 'error'::public.upload_row_validation_status then error_rows_count + 1 else error_rows_count end,
      updated_at = now()
  where id = p_schedule_upload_id;

  return v_row_id;
end;
$$;

revoke all on function public.add_schedule_upload_row(uuid, integer, jsonb, public.upload_row_validation_status, jsonb, uuid) from public, anon;
grant execute on function public.add_schedule_upload_row(uuid, integer, jsonb, public.upload_row_validation_status, jsonb, uuid) to authenticated, service_role;

create or replace function public.create_daily_demand(
  p_client_company_id uuid,
  p_demand_date date,
  p_total_passengers_expected integer default 0,
  p_total_shifts_count integer default 0,
  p_source_schedule_upload_id uuid default null,
  p_notes text default null,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_demand_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  select tenant_id into v_tenant_id from public.client_companies where id = p_client_company_id;
  if not found then
    raise exception 'Client company not found' using errcode = 'P0002';
  end if;

  if p_tenant_id is not null and p_tenant_id <> v_tenant_id then
    raise exception 'Cross-tenant violation' using errcode = '42501';
  end if;

  if not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.daily_demand (
    tenant_id, client_company_id, source_schedule_upload_id, demand_date, status, total_passengers_expected, total_shifts_count, notes
  )
  values (
    v_tenant_id, p_client_company_id, p_source_schedule_upload_id, p_demand_date, 'open'::public.daily_demand_status, coalesce(p_total_passengers_expected, 0), coalesce(p_total_shifts_count, 0), p_notes
  )
  returning id into v_demand_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'daily_demand_created'::public.audit_action_type,
    'daily_demand'::public.audit_entity_type, v_demand_id::text,
    jsonb_build_object('client_company_id', p_client_company_id, 'demand_date', p_demand_date)
  );

  return v_demand_id;
end;
$$;

revoke all on function public.create_daily_demand(uuid, date, integer, integer, uuid, text, uuid) from public, anon;
grant execute on function public.create_daily_demand(uuid, date, integer, integer, uuid, text, uuid) to authenticated, service_role;

create or replace function public.create_import_job(
  p_job_type public.import_job_type,
  p_metadata jsonb default '{}'::jsonb,
  p_tenant_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_tenant_id uuid;
  v_job_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '42501';
  end if;

  select email into v_email from public.profiles where id = v_user_id and status = 'active'::public.profile_status;
  if not found then
    raise exception 'Active profile required' using errcode = '42501';
  end if;

  if p_tenant_id is not null then
    v_tenant_id := p_tenant_id;
  else
    select active_tenant_id into v_tenant_id from public.user_tenant_context where user_id = v_user_id;
  end if;

  if v_tenant_id is null or not private.is_active_member(v_tenant_id) then
    raise exception 'Active tenant membership required' using errcode = '42501';
  end if;

  insert into public.import_jobs (
    tenant_id, job_type, status, initiated_by, started_at, metadata
  )
  values (
    v_tenant_id, p_job_type, 'queued'::public.import_job_status, v_user_id, now(), coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_job_id;

  insert into public.audit_events (
    actor_user_id, actor_email_snapshot, tenant_id, action_type, entity_type, entity_id, metadata
  ) values (
    v_user_id, v_email, v_tenant_id, 'import_job_started'::public.audit_action_type,
    'import_job'::public.audit_entity_type, v_job_id::text,
    jsonb_build_object('job_type', p_job_type)
  );

  return v_job_id;
end;
$$;

revoke all on function public.create_import_job(public.import_job_type, jsonb, uuid) from public, anon;
grant execute on function public.create_import_job(public.import_job_type, jsonb, uuid) to authenticated, service_role;
