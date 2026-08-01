# Reporte Técnico Final — Sprint 0: Productive Engineering Foundation

## 1. Resumen Ejecutivo

El Sprint 0 de **Transport Platform V2** ha sido completado exitosamente. Se ha establecido un monorepo limpio, reproducible y fuertemente tipado mediante `pnpm@11.18.0` y `Turborepo@2.4.4`, cumpliendo rigurosamente con los 11 ajustes obligatorios aprobados en el Plan de Implementación.

El repositorio `transport-platform-v2` cuenta con la arquitectura completa de monolito modular con separación estricta de responsabilidades, límites de compilación y ejecución, entorno Supabase local (PostGIS + pgTAP), suite de pruebas unitarias/E2E/seguridad y pipelines integrados de integración continua.

---

## 2. Referencia Inmutable del Prototipo UX

- **Repositorio de Referencia:** `https://github.com/abrahameister/transport-platform-ux-prototype`
- **Tag Oficial Aprobado:** `ux-v1-approved`
- **Commit SHA Inmutable:** `4c9488d98d18dbc25a1897e274a00f43c804ece2`
- **Cumplimiento de Límites:** Ningún componente ni arquitectura del prototipo fue copiado directamente. El prototipo sirvió exclusivamente como referencia UX visual y funcional.

---

## 3. Matriz de Versiones de Baseline Resueltas y Congeladas

| Tecnología / Herramienta  | Versión Declarada / Resuelta    | Restricción / Configuración          |
| ------------------------- | ------------------------------- | ------------------------------------ |
| **Node.js**               | `24.x` (latest patch)           | `engines.node`: `>=24 <25`           |
| **pnpm**                  | `11.18.0`                       | `packageManager`: `pnpm@11.18.0`     |
| **Turborepo**             | `2.4.4` (resolución `2.10.7`)   | `turbo: ^2.4.4`                      |
| **TypeScript**            | `5.8.2` (resolución `5.9.3`)    | strict baseline `tsconfig.base.json` |
| **Next.js (Web Shells)**  | `15.2.0` (resolución `15.5.22`) | App Router (`apps/web`)              |
| **Expo SDK (Driver App)** | `SDK 57` (`57.0.0`)             | Managed Workflow (`apps/driver`)     |
| **React**                 | `19.0.0` (Web) / Managed Expo   | No forzado globalmente               |
| **React Native**          | Managed por Expo SDK 57         | No forzado globalmente               |
| **Vitest**                | `4.0.0` (resolución `4.0.18`)   | Configurado en paquetes y worker     |
| **Playwright**            | `1.62.0` (resolución `1.62.1`)  | E2E smoke test suite                 |
| **Supabase CLI**          | `2.111.0`                       | Stack local Docker + PostGIS         |

---

## 4. Árbol Estructural del Monorepo

```
transport-platform-v2/
├── .github/
│   └── workflows/
│       ├── quality.yml          # Lint, format, typecheck, unit tests, doctor, export, build
│       ├── web-e2e.yml          # Playwright E2E smoke tests
│       ├── database.yml         # Supabase local stack, migrations replay & pgTAP
│       └── security.yml         # Auditoría de secretos y Gitleaks
├── apps/
│   ├── driver/                  # App Expo SDK 57 Conductor (tabs: Today, Activity, Profile)
│   ├── web/                     # Next.js 15 App Router (SuperAdmin, Operator, Client, Passenger, Sign-In)
│   └── worker/                  # Proceso Node.js 24 TypeScript (HTTP GET /health, SIGTERM/SIGINT)
├── packages/
│   ├── config/                  # Configuraciones compartidas (ESLint, Prettier, TypeScript)
│   ├── design-tokens/           # Tokens semánticos latam-b2b/light, elevación y tipografía
│   ├── observability/           # Logger estructurado JSON con redacción de credenciales
│   ├── supabase/                # Subpath exports (/browser, /server, /admin) con server-only
│   ├── test-utils/              # Fixtures sintéticos White-Label (Andina, Cordillera, Austral)
│   ├── ui-native/               # Componentes UI React Native base (Screen, Card, Button, Badge, etc.)
│   └── ui-web/                  # Componentes UI React 19 base (AppShell, Button, Card, TextField, etc.)
├── docs/
│   ├── adr/                     # Architectural Decision Records (0001-0005)
│   ├── architecture/            # Visión general y reglas de dependencia
│   ├── engineering/             # Guías de desarrollo, variables, testing, DB y reporte
│   └── product/                 # Trazabilidad de prototipo UX
├── scripts/
│   └── adversarial-scan.js      # Escáner de seguridad previo a commit
├── supabase/
│   ├── migrations/              # 20260731000000_init_infrastructure.sql (postgis + pgcrypto)
│   ├── tests/                   # 0001_infrastructure.test.sql (pgTAP)
│   ├── config.toml              # Configuración CLI Supabase local
│   └── seed.sql                 # Archivo seed limpio
├── tests/
│   ├── e2e/                     # Smoke tests Playwright
│   └── maestro/                 # Flujos de interacción Maestro para Driver App
├── .env.example                 # Plantilla de variables de entorno públicas y secretas
├── .gitignore                   # Exclusiones de Git
├── .nvmrc                       # Version Node 24
├── .prettierignore              # Exclusión de lockfiles y compilados
├── AGENTS.md                    # Directivas para Agentes de IA
├── CONTRIBUTING.md              # Guía de contribución
├── eslint.config.mjs            # ESLint 9 Flat Config con parser TypeScript
├── package.json                 # Configuración raíz de workspace pnpm
├── pnpm-workspace.yaml          # Declaración de workspaces y onlyBuiltDependencies
├── prettier.config.mjs          # Configuración Prettier
├── README.md                    # Documentación principal
├── tsconfig.base.json           # Configuración base estricta TypeScript
└── turbo.json                   # Enrutamiento de tareas y scoping de variables de entorno
```

---

## 5. Aplicaciones, Paquetes y Límites de Seguridad

### Aplicaciones

- `apps/web`: 5 shells funcionales de interfaz (`/`, `/platform`, `/operator`, `/client`, `/passenger`, `/sign-in`) utilizando `@transport-platform/ui-web` y `@transport-platform/design-tokens`.
- `apps/driver`: Aplicación nativa Expo SDK 57 con navegación por pestañas (`Today`, `Activity`, `Profile`) usando `@transport-platform/ui-native`.
- `apps/worker`: Servicio asíncrono en Node.js 24 con servidor HTTP de monitoreo (`GET /health`) y manejo limpio de señales de apagado.

### Paquetes y Exportaciones Controladas

- `@transport-platform/supabase`: Clientes aislados por contexto:
  - `@transport-platform/supabase/browser`: Cliente de navegador (Usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
  - `@transport-platform/supabase/server`: Cliente servidor Next.js.
  - `@transport-platform/supabase/admin`: Factory administrativa para Node.js y worker/scripts (Usa `SUPABASE_ADMIN_KEY`). Las aplicaciones Web Next.js consumen este cliente exclusivamente a través del adapter `apps/web/src/lib/supabase/admin.ts`, donde se aplica el límite `import 'server-only'` para impedir su importación en UI de cliente.
- Pruebas White-Label UI: Implementadas como **Contract Tests** (`theme.integration.test.tsx`) para verificar inyección de props y contratos estructurales del JSX en lugar de un renderizado DOM o nativo real.

---

## 6. Infraestructura de Base de Datos y Supabase CLI

- **Migración Inicial:** `supabase/migrations/20260731000000_init_infrastructure.sql` activa las extensiones `postgis` y `pgcrypto`.
- **Tablas de Dominio:** 0 tablas de dominio creadas en Sprint 0 (garantizando 100% de cumplimiento).
- **Pruebas de Infraestructura (pgTAP):** `supabase/tests/0001_infrastructure.test.sql` valida invariancias permanentes de infraestructura (existencia del esquema `extensions`, instalación de `postgis` y `pgcrypto` en dicho esquema, y retorno válido de la versión de PostGIS) sin depender de conteos frágiles de tablas que caducarán al iniciar el Bloque 1.

---

## 7. Verificación Local vs. Integración Continua (CI)

Se distingue estrictamente entre la ejecución en el entorno local del desarrollador y las pruebas automatizadas en los corredores oficiales de GitHub Actions sobre el SHA objetivo:

| Comando / Suite        | Entorno de Validación | Criterio de Verificación / Observaciones                                                                  |
| ---------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm format:check`    | Local + CI (Quality)  | Verificación de estilo Prettier sin modificaciones accidentales.                                          |
| `pnpm lint`            | Local + CI (Quality)  | ESLint 9 en todos los paquetes del monorepo.                                                              |
| `pnpm typecheck`       | Local + CI (Quality)  | Verificación estricta `tsc --noEmit` sin supresiones ni `!`.                                              |
| `pnpm test`            | Local + CI (Quality)  | Unit y Contract tests via Vitest v4.                                                                      |
| `pnpm db:test` (pgTAP) | CI (Database) / Local | Requiere motor de contenedores Docker/Podman activo. Valida invariancias permanentes de PostGIS/pgcrypto. |
| `pnpm security:scan`   | Local + CI (Security) | Auditoría local sin secretos y sin ORMs.                                                                  |
| `pnpm test:e2e`        | Local + CI (Web E2E)  | Pruebas de humo Playwright sobre las web shells.                                                          |
| `pnpm driver:doctor`   | Local + CI (Quality)  | Diagnóstico de dependencias e integridad de Expo SDK 57.                                                  |
| `pnpm driver:export`   | Local + CI (Quality)  | Compilación y exportación de artefactos de app nativa.                                                    |
| `pnpm build`           | Local + CI (Quality)  | Compilación estática de todos los proyectos del workspace.                                                |

_Nota: La aprobación formal del Sprint 0 requiere que los cuatro workflows oficiales en GitHub Actions culminen en estado `success` sobre el SHA final commit del PR #1._

---

## 8. Cobertura de Integración Continua (GitHub Actions)

El repositorio es protegido por cuatro workflows independientes:

1. `.github/workflows/quality.yml`: Ejecuta verificación de formato, linting, typecheck, unit/contract tests, `expo-doctor`, `driver:export` y build del workspace.
2. `.github/workflows/web-e2e.yml`: Levanta el servidor Next.js y ejecuta pruebas Playwright para validar flujos básicos en web shells.
3. `.github/workflows/database.yml`: Utiliza Supabase CLI (`2.111.0`) en entorno Docker para inicializar stack local, aplicar migraciones desde cero, ejecutar pruebas pgTAP (`pnpm db:test`) y detener la instancia limpiamente (`supabase stop`).
4. `.github/workflows/security.yml`: Ejecuta escáner personalizado (`pnpm security:scan`) y `gitleaks-action` sin supresiones para impedir fugas de credenciales o secretos en el historial.

---

## 9. Reporte del Escáner Adversario de Seguridad

El escáner sintético `scripts/adversarial-scan.js` se ejecutó contra la totalidad del código fuente arrojando:

- **Secretos detectados:** `0` (Sin claves JWT, Service Keys o tokens expuestos).
- **Patrones de Auth Mock detectados:** `0` (No existen `SuperAdminContext`, `OperationalContext`, `ClientPortalContext`, `DriverContext`, ni usuarios falsos hardcodeados).
- **ORMs Prohibidos detectados:** `0` (No existe rastro de Prisma, Drizzle, TypeORM o Sequelize).

---

## 10. Deuda Técnica Conocida y Elementos Diferidos

### Elementos Marcados explícitamente como DEFERRED para Sprints Posteriores:

- **Archivos de fuentes tipográficas personalizadas:** Uso de `fontFamily.fallback` (`system-ui, sans-serif`).
- **Paletas cromáticas primitivas extendidas:** Únicamente tokens semánticos de negocio B2B activos.
- **Assets de marca finales:** Uso de imágenes placeholder SVG/PNG.
- **Bundle Identifiers / Package Names definitivos:** Configurados provisionalmente como `.dev`.
- **EAS Project ID y credenciales móviles de producción:** No configurados.
- **Dominios personalizados de producción:** Entorno configurado en `localhost`.

---

## 11. Conclusión y Declaración de Estado

Los bloqueadores remanentes de calidad y base de datos correspondientes a la fundación de Sprint 0.1 han sido reparados sobre la rama `chore/sprint-0-foundation-repair` (partiendo del SHA base `2190b163af2b727a7912a739693bc4a402b835b4`).

**ESTADO FINAL DEL REPOSITORIO:** **`PENDING CI CONFIRMATION`** (Listo para fusionarse en `main` una vez que los cuatro workflows oficiales confirmen estado `success` en GitHub Actions sobre el SHA del commit de reparación).
