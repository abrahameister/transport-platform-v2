# ADR 0003: Persistencia Basada en Migraciones SQL y Supabase Local

## Estado

Aprobado (APPROVED)

## Contexto

El sistema requiere una persistencia sólida con soporte geoespacial (PostGIS) y seguridad por fila (RLS).

## Decisión

- La fuente de verdad para la base de datos son las migraciones SQL secuenciales bajo `supabase/migrations/`.
- No se utilizará ningún ORM (Prisma, Drizzle, TypeORM, Sequelize) en Sprint 0.
- El desarrollo y las pruebas se realizan exclusivamente contra el stack local de Supabase (`pnpm db:start`, `pnpm db:reset`, `pnpm db:test`). Quedan prohibidos los comandos remotos (`supabase login`, `supabase link`, `supabase db push`, `supabase db pull`).
