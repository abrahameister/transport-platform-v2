# ADR 0004: Estrategia de Design Tokens y Sistema de Diseño

## Estado

Aprobado (APPROVED)

## Contexto

El sistema de diseño debe soportar capacidad White-Label para múltiples empresas transportistas sin duplicar código de componentes.

## Decisión

- Todos los componentes consumen tokens semánticos del paquete `@transport-platform/design-tokens` (`latam-b2b/light`).
- No se utilizan colores primitivos ni valores hexadecimales directamente en los componentes UI.
- Los componentes UI Web y Native se alimentan de proveedores contextuales (`BrandProvider`, `ThemeProvider`).
