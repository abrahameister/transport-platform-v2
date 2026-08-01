# ADR 0002: Prototipo UX como Referencia Inmutable de Solo Lectura

## Estado

Aprobado (APPROVED)

## Contexto

El prototipo UX alojado en `https://github.com/abrahameister/transport-platform-ux-prototype` contiene el diseño y comportamiento aprobado bajo el tag `ux-v1-approved` (SHA: `4c9488d98d18dbc25a1897e274a00f43c804ece2`).

## Decisión

El prototipo UX es estrictamente de **solo lectura**.
No se copiarán contextos React en memoria, mocks, fixtures simulados, generadores aleatorios ni selecciones de rol en cliente. La arquitectura productiva es independiente.
