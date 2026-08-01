# Database & Supabase Local Workflow — Transport Platform V2

This document defines the database management workflow for **Transport Platform V2**.

## Architectural Directives & Strict Boundaries

> [!CAUTION]
> **Prohibited Remote Database Commands in Sprint 0 / Local Development**:
>
> - `supabase login` — Prohibited
> - `supabase link` — Prohibited
> - `supabase db push` — Prohibited
> - `supabase db pull` (remote) — Prohibited
> - Remote database connection strings — Prohibited
> - Real remote API keys or secrets in source code — Prohibited

All persistence development is conducted **100% locally** using Supabase CLI and Docker.

---

## Local Database Commands

```bash
# Start local Supabase Docker stack
pnpm db:start

# Replay migrations from scratch
pnpm db:reset

# Run pgTAP infrastructure tests
pnpm db:test

# Check local container status
pnpm db:status

# Stop local Supabase stack
pnpm db:stop
```

---

## Extensions Schema Strategy

PostgreSQL extensions (`postgis`, `pgcrypto`) are installed explicitly into the `extensions` schema:

```sql
create schema if not exists extensions;

create extension if not exists postgis
  with schema extensions;

create extension if not exists pgcrypto
  with schema extensions;
```

pgTAP tests verify `extensions.postgis_full_version()` and assert `0` domain tables in `public`.
