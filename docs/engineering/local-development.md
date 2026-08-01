# Desarrollo Local

## Requisitos Previos

- Node.js 24 LTS (`24.14.0`)
- pnpm `11.18.0`
- Docker Desktop / Engine (requerido para Supabase Local)
- Supabase CLI `2.111.0`

## Comandos Principales

```bash
# Instalación limpia
pnpm install --frozen-lockfile

# Iniciar servidor de desarrollo global
pnpm dev

# Iniciar aplicaciones individuales
pnpm --filter web dev
pnpm --filter driver dev
pnpm --filter worker dev

# Iniciar stack local de Supabase
pnpm db:start
pnpm db:reset

# Ejecutar suite de verificación de calidad
pnpm check
```
