---
applyTo: "src/locale/**"
---

- Every translation key must exist in all five files: `it.ts`, `en.ts`, `fr.ts`, `sl.ts`, `de.ts`.
- Keep the same key structure and ordering across files; `it.ts` is the reference language.
- Preserve interpolation placeholders (`{{name}}`) and `<Trans>` markup exactly in each translation.
- Languages are registered in `src/locale/index.ts` via `configureI18n`; do not bypass it.
