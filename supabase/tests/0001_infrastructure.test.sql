-- Infrastructure Verification Test Suite — Transport Platform V2 (pgTAP)

begin;

select plan(5);

-- 1. Verify schema 'extensions' exists
select has_schema('extensions', 'Schema extensions should exist');

-- 2. Verify PostGIS extension is installed
select has_extension('postgis', 'PostGIS extension should be installed');

-- 3. Verify pgcrypto extension is installed
select has_extension('pgcrypto', 'pgcrypto extension should be installed');

-- 4. Verify extensions.postgis_full_version() function returns valid string
select isnt_empty(
  extensions.postgis_full_version(),
  'extensions.postgis_full_version() should return a non-empty version string'
);

-- 5. Verify 0 domain tables exist in public schema
select is(
  (select count(*)::integer from information_schema.tables where table_schema = 'public'),
  0,
  'Public schema should contain exactly 0 domain tables in Sprint 0'
);

select * from finish();

rollback;
