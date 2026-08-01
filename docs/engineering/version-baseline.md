# Versiones de Baseline Congeladas — Transport Platform V2 (Sprint 0.1)

Este documento registra las versiones exactas y resueltas del stack tecnológico productivo para asegurar reproducibilidad absoluta.

## Matriz de Baseline Principal

| Componente            | Versión Declarada | Versión Resuelta en Lockfile | Restricción / Configuración                         |
| --------------------- | ----------------- | ---------------------------- | --------------------------------------------------- |
| **Node.js**           | `>=24 <25`        | `24.x LTS`                   | Enforzado en `package.json` (`engines`) y `.nvmrc`  |
| **pnpm**              | `11.18.0`         | `11.18.0`                    | Declarado en `package.json` (`packageManager`)      |
| **Turborepo**         | `^2.4.4`          | `2.10.7`                     | Gestor de monorepo                                  |
| **TypeScript**        | `^5.8.2`          | `5.9.3`                      | Enforzado con `tsconfig.base.json`                  |
| **Next.js (Web)**     | `^15.2.0`         | `15.5.22`                    | App Router (`apps/web`)                             |
| **Expo SDK (Driver)** | `~57.0.0`         | `57.0.0`                     | Managed Workflow (`apps/driver`)                    |
| **React Native**      | Managed SDK 57    | `0.86.2`                     | Prohibido fijar manualmente versión desalineada     |
| **React (Mobile)**    | Managed SDK 57    | `19.2.3`                     | Prohibido fijar manualmente versión desalineada     |
| **Expo Router**       | Managed SDK 57    | `57.0.9`                     | Enrutamiento móvil por archivos (`apps/driver/app`) |
| **React Native Web**  | Managed SDK 57    | `0.21.2`                     | Bundling multi-plataforma para web/android/ios      |
| **Vitest**            | `^4.0.0`          | `4.1.10`                     | Runner de unit tests                                |
| **Playwright**        | `^1.62.0`         | `1.62.1`                     | Runner de smoke tests E2E                           |
| **Supabase CLI**      | `^2.111.0`        | `2.111.0`                    | Entorno de desarrollo local con Docker              |

## Validación de Expo SDK 57

```bash
pnpm --filter @transport-platform/driver exec npx expo install --check
pnpm dlx expo-doctor@1.12.0 apps/driver
pnpm --filter @transport-platform/driver exec expo export --platform all
```

- **Resultado `expo-doctor`:** 18/18 checks pasados con 0 errores.
- **Resultado `expo export --platform all`:** 3 bundles exportados (Web, Android, iOS) y 131 assets empacados a `apps/driver/dist`.
