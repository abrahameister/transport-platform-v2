-- Migration: 20260731000000_init_infrastructure.sql
-- Description: Enables initial infrastructure extensions (PostGIS, pgcrypto).
-- Note: 0 domain operational tables are created in Sprint 0.

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

COMMENT ON EXTENSION "postgis" IS 'PostGIS geometry and geography spatial extension for Transport Platform V2';
COMMENT ON EXTENSION "pgcrypto" IS 'Cryptographic functions for hashing and security';
