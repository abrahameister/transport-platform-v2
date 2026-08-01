# Reglas de Dependencias e Importaciones

## Matriz de Permitividad

1. `apps/web` puede importar `@transport-platform/ui-web`, `@transport-platform/design-tokens`, `@transport-platform/supabase/browser`, `@transport-platform/supabase/server`, `@transport-platform/observability`.
2. `apps/driver` puede importar `@transport-platform/ui-native`, `@transport-platform/design-tokens`, `@transport-platform/supabase/browser`, `@transport-platform/observability`.
3. `apps/worker` puede importar `@transport-platform/supabase/admin`, `@transport-platform/observability`.
4. `packages/design-tokens` no depende de ningún otro paquete del monorepo.
5. Componentes de UI (`ui-web`, `ui-native`) declaran `react` como `peerDependency` y consumen tokens de `@transport-platform/design-tokens`.

## Prohibiciones Estrictas

- `apps/web` y `apps/driver` **NUNCA** pueden importar `@transport-platform/supabase/admin`. El archivo `admin.ts` contiene `import 'server-only'` para forzar fallos en compilación.
- Los paquetes compartidos **NUNCA** importan aplicaciones.
- No se permiten dependencias circulares entre paquetes.
