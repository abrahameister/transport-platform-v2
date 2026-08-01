# Estrategia de Testing

## Pruebas Unitarias (Vitest 4.x)

- Ejecutadas con `pnpm test`.
- Validan paquetes compartidos (`design-tokens`, `ui-web`, `ui-native`, `supabase`, `observability`, `test-utils`) y el proceso `worker`.

## Pruebas End-to-End (Playwright 1.62.x)

- Ejecutadas con `pnpm test:e2e`.
- Levantan la aplicación web Next.js y verifican la carga sin errores de la página de estado base y las 5 cáscaras de infraestructura (`/platform`, `/operator`, `/client`, `/passenger`, `/sign-in`).

## Pruebas de Aplicación Móvil (Maestro)

- Configuración definida en `tests/maestro/driver-flow.yaml`.
- Ejecución local cuando exista el entorno simulador/dispositivo.

## Pruebas de Base de Datos (pgTAP)

- Ejecutadas con `pnpm db:test`.
- Ejecutan los scripts SQL en `supabase/tests/` verificando extensiones (PostGIS) y garantizando 0 tablas de dominio operacionales.
