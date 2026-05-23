# CLAUDE.md

We are rebuilding an old application into a modern, maintainable, independent product.

Product:
- App for personal trainers, coaches, fitness professionals and their clients.
- B2B/B2C.
- Available as web app, iOS app and Android app.
- Premium startup product with enterprise-grade reliability and Apple-level polish.

Primary goals:
- Rewrite old repo into modern architecture.
- Keep stack simple, independent and easy to maintain.
- Enable parallel work between agents.
- Avoid overengineering.
- Prefer clarity, modularity and long-term maintainability.

Preferred stack:
- Web: Next.js + React + TypeScript
- Mobile: Expo + React Native + TypeScript
- Backend: simple Node.js API or Supabase where useful
- UI: shared design system where possible
- Styling: Tailwind / NativeWind
- Database: PostgreSQL
- i18n: shared translation layer

Shared docs:
- docs/PROJECT_CONTEXT.md
- docs/ROADMAP.md
- docs/ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md
- docs/I18N_GUIDE.md
- docs/AGENT_WORKFLOW.md

Rules:
- Do not rewrite large parts without a plan.
- Before changing architecture, update docs/ARCHITECTURE.md.
- Before changing UI patterns, update docs/DESIGN_SYSTEM.md.
- Before adding user-facing copy, update i18n files.
- Keep features small and shippable.
- Prefer simple solutions.
- Explain important decisions briefly.