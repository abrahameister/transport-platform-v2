# Flujo de Trabajo con Base de Datos (Supabase Local)

## Principios Fundamentales

1. **Exclusividad Local en Sprint 0:** Todas las operaciones ocurren contra el stack local de Supabase.
2. **Prohibición de Comandos Remotos:** Queda estrictamente prohibido ejecutar `supabase login`, `supabase link`, `supabase db push` o `supabase db pull` contra proyectos remotos.
3. **Persistencia mediante Migraciones:** Los cambios a la base de datos se implementan secuencialmente en `supabase/migrations/`.

## Comandos Disponibles

```bash
# Iniciar stack local de Supabase
pnpm db:start

# Detener stack local
pnpm db:stop

# Consultar estado local
pnpm db:status

# Reiniciar base de datos y reaplicar migraciones desde cero
pnpm db:reset

# Ejecutar pruebas SQL (pgTAP)
pnpm db:test
```
