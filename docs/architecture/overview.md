# Visión General de la Arquitectura — Transport Platform V2

## Monolito Modular en Monorepo

Transport Platform V2 está estructurado como un monolito modular dentro de un monorepo pnpm y Turborepo.

### Estructura de Aplicaciones

- `apps/web`: Aplicación Next.js 15 (App Router) con Server Components por defecto. Contiene las cáscaras de interfaz para SuperAdministrador, Empresa Transportista, Empresa Cliente, PWA de Pasajero e Inicio de Sesión.
- `apps/driver`: Aplicación Expo SDK 57 (Expo Router) para Conductores en dispositivos móviles.
- `apps/worker`: Proceso en segundo plano Node.js 24 TypeScript para tareas asíncronas.

### Estructura de Paquetes Compartidos

- `packages/design-tokens`: Tokens semánticos tipados (colección `latam-b2b/light`).
- `packages/ui-web`: Componentes base web que consumen tokens semánticos.
- `packages/ui-native`: Componentes base React Native que consumen tokens semánticos.
- `packages/supabase`: Factories de clientes Supabase con subpath exports estrictos (`/browser`, `/server`, `/admin`).
- `packages/observability`: Logger estructurado JSON con sanitización automática de datos sensibles.
- `packages/test-utils`: Fixtures sintéticos White-Label (`Transportes Andina`, `Movilidad Cordillera`, `Transfer Austral`).
- `packages/config`: Configuraciones reutilizables de TypeScript, ESLint y Prettier.

### Principios Fundamentales

- **Persistencia Única:** PostgreSQL / PostGIS con Row Level Security (RLS). No se utilizan ORMs (Prisma, Drizzle, TypeORM, Sequelize).
- **Prototipo UX Read-Only:** El repositorio `transport-platform-ux-prototype` tag `ux-v1-approved` es la fuente inmutable de verdad visual y terminológica.
