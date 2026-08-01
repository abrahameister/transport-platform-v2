# Guía de Contribución — Transport Platform V2

## Flujo de Trabajo

1. **Ramas:** Crear ramas descriptivas a partir de `main` (ej: `feat/foo`, `fix/bar`, `chore/sprint-0-foundation`).
2. **Commits:** Usar Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
3. **Pull Requests:** Todos los cambios deben pasar mediante Pull Request con CI en verde.

## Verificación de Código Local

Antes de enviar un Pull Request, asegúrese de que la siguiente suite pase sin advertencias ni errores:

```bash
pnpm check
```

## Convenciones de Base de Datos

- Las modificaciones a la base de datos se realizan exclusivamente mediante archivos de migración SQL etiquetados secuencialmente en `supabase/migrations/`.
- No ejecutar modificaciones directas en ambientes de desarrollo ni producción.
- Validar las migraciones localmente mediante `pnpm db:reset` y `pnpm db:test`.
