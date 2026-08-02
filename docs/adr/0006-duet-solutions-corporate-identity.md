# ADR 0006: Adhesión a Identidad Corporativa Duet Solutions

## Estado

Aprobado (APPROVED) — Implementado en Bloque 2

## Contexto

La plataforma requiere alinearse estrictamente al look & feel corporativo B2B y técnico de **Duet Solutions** para garantizar claridad operativa en entornos de alta criticidad, evitando elementos decorativos innecesarios (degradados chillones, sombras exageradas o colores genéricos).

## Decisión

1. **Paleta Semántica Corporativa:**
   - **Base Estructural & Tipográfica:** Azul Marino (`#1C3B57`) para encabezados, barras superiores y tipografía de contraste principal.
   - **Call to Action (CTA) Primario:** Naranja Duet (`#E8832A`) para acciones principales, botones de confirmación e indicadores activos.
   - **Éxito / Estado Activo:** Verde Duet (`#88A947`) para indicadores positivos y de sesión activa.
   - **Fondos y Contenedores:** Grises suaves (`#F8F9FA`, `#CBD5E1`) y superficies blancas (`#FFFFFF`).

2. **Capa de Componentes (`ui-web` & `ui-native`):**
   - Refactorización de componentes básicos (`Button`, `Card`, `Table`, `Alert`, etc.) para consumir los tokens de `@transport-platform/design-tokens` sin depender de estilos inline dispersos ni degradados de marketing.
   - Eliminación de sombras fuertes, sustituidas por sombras sutiles de control operacional e índices de elevación acotados (`0 1px 3px rgba(28, 59, 87, 0.1)`).

3. **Consistencia Web & Mobile:**
   - Tanto la aplicación web (`apps/web`) como la terminal nativa de conductor (`apps/driver`) comparten la misma jerarquía visual de control operacional B2B.
