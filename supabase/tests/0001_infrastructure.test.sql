-- Test: 0001_infrastructure.test.sql
-- Verifies that PostGIS is installed and no operational domain tables exist in Sprint 0.

BEGIN;
SELECT plan(2);

-- 1. Check if postgis extension is installed
SELECT has_extension('extensions', 'postgis', 'PostGIS extension should be installed under extensions schema');

-- 2. Verify 0 domain tables exist in public schema
SELECT is_empty(
  $$ SELECT tablename FROM pg_tables WHERE schemaname = 'public' $$,
  'Public schema must not contain any operational domain tables in Sprint 0'
);

SELECT * FROM finish();
ROLLBACK;
