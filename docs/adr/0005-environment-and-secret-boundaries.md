# ADR 0005: Límites de Variables de Entorno y Claves Secretas

## Estado

Aprobado (APPROVED)

## Contexto

Es crítico evitar la filtración de secretos administrativos a código o bundles de interfaz de usuario (Web o Driver).

## Decisión

- Las aplicaciones Web y Driver consumen exclusivamente claves públicas (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
- La clave administrativa `SUPABASE_SECRET_KEY` está restringida al servidor/worker.
- El paquete `@transport-platform/supabase` expone subpath exports estrictos (`/browser`, `/server`, `/admin`). `/admin` incluye `import 'server-only'` y no puede importarse desde paquetes de UI.
