# Baseline Técnico de Versiones — Transport Platform V2

Este documento registra el baseline exacto de versiones estables fijadas para el proyecto.

| Herramienta / Librería | Versión Exacta / Rango Fijado | Notas de Configuración                                                         |
| ---------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| **Node.js**            | `v24.14.0`                    | Node 24 LTS. Pinned in `.nvmrc`, `.node-version`, `engines.node: ">=24 <25"`   |
| **pnpm**               | `11.18.0`                     | Pinned in `packageManager: "pnpm@11.18.0"`                                     |
| **Turborepo**          | `^2.4.4`                      | Gestor de monorepo                                                             |
| **Next.js**            | `^15.2.0`                     | App Router (creado con `create-next-app@latest`)                               |
| **React**              | `^19.0.0`                     | Administrado por Next.js y Expo (peerDependency en UI)                         |
| **Expo SDK**           | `~57.0.0`                     | SDK 57 estable (creado con `create-expo-app@latest --template default@sdk-57`) |
| **React Native**       | `0.76.7`                      | Administrado por Expo SDK 57                                                   |
| **Supabase CLI**       | `^2.111.0`                    | Herramienta CLI de base de datos local                                         |
| **TypeScript**         | `^5.8.2`                      | Compilador TypeScript en modo estricto                                         |
| **Vitest**             | `^4.0.0`                      | Vitest v4 estable para pruebas unitarias                                       |
| **Playwright**         | `^1.62.0`                     | Playwright estable para pruebas E2E web                                        |
| **Maestro**            | `1.x`                         | Flujos de prueba para la aplicación Driver                                     |
