-- Initial Infrastructure Migration — Transport Platform V2
-- Establishes extensions schema, PostGIS and pgcrypto extensions.
-- 0 domain tables created in Sprint 0.

create schema if not exists extensions;

create extension if not exists postgis
  with schema extensions;

create extension if not exists pgcrypto
  with schema extensions;
