-- Infrastructure Verification Test Suite — Transport Platform V2 (pgTAP)

begin;

select plan(6);

-- 1. Verify schema 'extensions' exists
select has_schema('extensions', 'Schema extensions should exist');

-- 2. Verify PostGIS extension is installed
select has_extension('postgis', 'PostGIS extension should be installed');

-- 3. Verify pgcrypto extension is installed
select has_extension('pgcrypto', 'pgcrypto extension should be installed');

-- 4. Verify PostGIS is installed in schema 'extensions'
select is(
  (select extnamespace::regnamespace::text from pg_extension where extname = 'postgis'),
  'extensions',
  'PostGIS extension should be located in extensions schema'
);

-- 5. Verify pgcrypto is installed in schema 'extensions'
select is(
  (select extnamespace::regnamespace::text from pg_extension where extname = 'pgcrypto'),
  'extensions',
  'pgcrypto extension should be located in extensions schema'
);

-- 6. Verify extensions.postgis_full_version() function returns valid string
select ok(
  nullif(btrim(extensions.postgis_full_version()), '') is not null,
  'PostGIS should return a non-empty version string'
);

select * from finish();

rollback;
