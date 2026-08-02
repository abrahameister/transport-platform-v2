# ADR 0007: Honest Operational UX and Zero-Mock Policy

## Status

Accepted

## Context

During initial iterative sprints, various dashboard screens in both the Web application (`apps/web`) and the Driver Native Application (`apps/driver`) utilized promotional placeholder copy (such as "Next Release", "Sprint 2+", "Habilitado en Bloque 2", "Lectura QR", and simulated GPS tracking cards) to indicate future functional scope.

When validating the software locally against Supabase DEV, these decorative cards and aspirational labels created a "startup pitch demo" feel and obscured the real, production-ready features already functioning (such as PostgreSQL Row-Level Security isolation, dynamic HSL tenant branding, real-time membership interrogation, and native Expo terminal authentication). Furthermore, mentions of deprecated features (e.g., QR reading) persisted in static copy.

## Decision

As Principal Front-End Architect and Design System Owner, we establish an immutable **Honest Operational UX Policy** across all front-end and native interfaces of Transport Platform V2 under the Duet Solutions corporate visual direction:

1. **Strict Reality Trichotomy**:
   - **Fully Operational**: Features that are implemented and connect directly to real database records (e.g., membership counts, invitations, RLS guards) must be presented with full clarity, interactive data tables, and executable CTAs.
   - **In Progress / Architectural Readiness**: Modules that are architected in the backend but disabled in the current DEV environment (e.g., Batch CSV imports) must display explicit technical specifications (such as expected template schemas) and an honest status badge (`DESHABILITADO EN DEV` or `EN PROCESO REAL`) explaining the technical prerequistes for enablement.
   - **Explicitly Disabled / Out of Scope**: If a module is inactive for a tenant (e.g., live route scheduling, client accounts), the UI must show a clean, B2B enterprise empty state or disable notice without simulating fake live GPS traffic, decorative mockups, or arbitrary random generators (`Math.random()`).

2. **Eradication of Promotional Copy and QR References**:
   - All references to "Next Release", "Sprint 2+", "Bloque 2/3", and "Lectura QR" / "QR" are forbidden in customer-facing and operator-facing UI text.
   - All components must convey the tone of a mission-critical, high-reliability logistics platform (Navy `#1C3B57` base, Orange `#E8832A` primary CTA, soft grays for surfaces).

3. **Multi-Page Operational Navigation**:
   - The `/operator` portal is structured into purpose-driven sub-routes (`/operator/employees`, `/operator/clients`, `/operator/imports`, `/operator/demand`) supported by a shared server-authenticated shell layout, allowing operators to interrogate real database state seamlessly.

## Consequences

- **Positive**: Testing locally against Supabase DEV presents a serious, corporate, 100% truthful B2B software application. Users can clearly distinguish active security and identity capabilities from pending transactional engines.
- **Negative / Compliance**: Developers can no longer drop "placeholder cards" or "coming soon" badges during feature development; if a screen is exposed, it must reflect actual state or document exact technical readiness without promotional hype.
