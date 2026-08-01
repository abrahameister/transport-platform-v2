# Transport Platform V2 — Productive Monorepo Foundation (Sprint 0)

[![Quality & Build](https://github.com/abrahameister/transport-platform-v2/actions/workflows/quality.yml/badge.svg)](https://github.com/abrahameister/transport-platform-v2/actions/workflows/quality.yml)
[![Web E2E](https://github.com/abrahameister/transport-platform-v2/actions/workflows/web-e2e.yml/badge.svg)](https://github.com/abrahameister/transport-platform-v2/actions/workflows/web-e2e.yml)
[![Database Pipeline](https://github.com/abrahameister/transport-platform-v2/actions/workflows/database.yml/badge.svg)](https://github.com/abrahameister/transport-platform-v2/actions/workflows/database.yml)

Fundación técnica productiva, limpia, reproducible y verificable para Transport Platform V2.

## Referencia UX Inmutable

- **Prototipo UX:** [transport-platform-ux-prototype](https://github.com/abrahameister/transport-platform-ux-prototype)
- **Tag:** `ux-v1-approved`
- **Tag Commit SHA:** `4c9488d98d18dbc25a1897e274a00f43c804ece2` (Tag object: `00b426066d566ab7646d2b9c5895459852e489ed`)
- Consulte [docs/product/ux-reference.md](docs/product/ux-reference.md) para más detalles.

## Baseline de Versiones Fijadas

- **Node.js:** `v24.14.0` (LTS, `engines.node: ">=24 <25"`)
- **pnpm:** `11.18.0` (`packageManager: "pnpm@11.18.0"`)
- **Turborepo:** `^2.4.4`
- **Next.js:** `^15.2.0` (App Router)
- **Expo SDK:** `~57.0.0` (Expo Router)
- **Supabase CLI:** `^2.111.0`
- **TypeScript:** `^5.8.2`
- **Vitest:** `^4.0.0`
- **Playwright:** `^1.62.0`
- Consulte [docs/engineering/version-baseline.md](docs/engineering/version-baseline.md).

## Estructura del Monorepo

```
transport-platform-v2/
├── apps/
│   ├── web/           # Next.js 15 App Router (SuperAdmin, Operator, Client, Passenger, Sign-In shells)
│   ├── driver/        # Expo SDK 57 App (Today, Activity, Profile tabs)
│   └── worker/        # Proceso Node.js 24 TypeScript (GET /health)
├── packages/
│   ├── design-tokens/ # Tokens semánticos latam-b2b/light
│   ├── ui-web/        # Componentes base web
│   ├── ui-native/     # Componentes base React Native
│   ├── supabase/      # Subpath exports (/browser, /server, /admin)
│   ├── observability/ # Logger estructurado JSON con sanitización
│   ├── test-utils/    # Fixtures sintéticos White-Label
│   └── config/        # Configuraciones reutilizables
├── supabase/
│   ├── migrations/    # Migración de infraestructura (PostGIS, pgcrypto)
│   ├── tests/         # Pruebas pgTAP
│   ├── config.toml    # Configuración local de Supabase
│   └── seed.sql       # Seed sin datos de dominio
├── tests/
│   ├── e2e/           # Pruebas Playwright smoke web
│   └── maestro/       # Pruebas Maestro para app móvil
└── docs/              # Arquitectura, ADRs e Ingeniería
```

## Inicio Rápido Local

```bash
# Habilitar corepack e instalar dependencias
corepack enable
pnpm install --frozen-lockfile

# Iniciar servidor de desarrollo
pnpm dev

# Iniciar stack local de Supabase (requiere Docker)
pnpm db:start

# Ejecutar suite completa de calidad
pnpm check
```

## Documentación Completa

- [Visión General de la Arquitectura](docs/architecture/overview.md)
- [Reglas de Dependencias](docs/architecture/dependency-rules.md)
- [Desarrollo Local](docs/engineering/local-development.md)
- [Variables de Entorno](docs/engineering/environment-variables.md)
- [Estrategia de Testing](docs/engineering/testing.md)
- [Flujo de Base de Datos](docs/engineering/database-workflow.md)
- [ADRs Registrados](docs/adr/0001-monorepo-and-modular-monolith.md)
