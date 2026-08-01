# AGENTS.md — Directivas para Agentes IA en Transport Platform V2

Este archivo contiene las directivas obligatorias para cualquier agente IA (Antigravity, Claude, ChatGPT, etc.) que trabaje en el repositorio productivo `transport-platform-v2`.

## 1. Regla Inmutable de Referencia UX

- **Prototipo UX:** `https://github.com/abrahameister/transport-platform-ux-prototype` @ `ux-v1-approved`
- El prototipo UX es **exclusivamente de solo lectura**.
- **PROHIBIDO:** Copiar su arquitectura React, contextos en memoria (`SuperAdminContext`, `OperationalContext`, `ClientPortalContext`, `DriverContext`), `Math.random()`, mocks de autenticación, selecciones de rol en cliente o simulaciones de estado.
- Usar el prototipo únicamente como referencia visual, terminológica, de navegación y de criterios de aceptación.

## 2. Límites Arquitectónicos

- Mantener un **Monolito Modular** dentro del monorepo pnpm/Turborepo.
- **NO crear:** Microservicios, múltiples backends, API Gateways, GraphQL, autenticación paralela, ni JWT personalizados.
- **NO incorporar ORMs:** Prisma, Drizzle, TypeORM y Sequelize quedan prohibidos. La persistencia y seguridad residen en PostgreSQL, PostGIS y Supabase RLS mediante migraciones SQL.

## 3. Delimitación de Claves de Supabase

- **Públicas / Cliente:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Web) y `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Driver).
- **Secreta / Servidor:** `SUPABASE_ADMIN_KEY` (exclusiva para worker/runtime del servidor).
- **NUNCA** importar `@transport-platform/supabase/admin` desde componentes de UI cliente (Web o Driver). Usar subpath exports estrictos.

## 4. Calidad y Verificación

- Antes de considerar una tarea finalizada, ejecutar obligatoriamente:
  ```bash
  pnpm check
  ```
- Mantener la documentación actualizada y registrar cualquier decisión relevante en un ADR bajo `docs/adr/`.
