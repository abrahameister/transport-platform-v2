# ADR 0001: Monorepo y Monolito Modular

## Estado

Aprobado (APPROVED)

## Contexto

Transport Platform V2 requiere coordinar múltiples aplicaciones (Web Next.js, Expo Driver, Worker Node.js) y paquetes compartidos (Design Tokens, UI Web, UI Native, Supabase, Observabilidad, Test Utils) manteniendo simplicidad operativa y límites arquitectónicos claros.

## Decisión

Adoptar una arquitectura de **Monolito Modular dentro de un Monorepo** gestionado con `pnpm` workspaces y `Turborepo`.

Se prohíbe explícitamente:

- Crear microservicios.
- Crear múltiples backends.
- Crear un API Gateway.
- Implementar GraphQL.
