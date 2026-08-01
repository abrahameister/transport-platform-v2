# Gestión de Variables de Entorno y Secretos

## Clasificación de Variables

### Variables Públicas de Cliente

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Clave pública de Supabase para la aplicación Web.
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Clave pública de Supabase para la aplicación Expo Driver.

### Variables Privadas del Servidor / Worker

- `SUPABASE_ADMIN_KEY`: Clave administrativa de Supabase. **Solo puede existir en entornos del servidor/worker y nunca incluirse en builds o ejecutables de UI.**

## Límites de Turborepo

Turborepo delimita estrictamente las variables de entorno expuestas a las tareas de build (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NODE_ENV`). `SUPABASE_ADMIN_KEY` no se declara como variable global en `turbo.json`.
