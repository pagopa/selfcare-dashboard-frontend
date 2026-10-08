---
applyTo: "**/__tests__/**,src/**/*.test.{ts,tsx}"
---

- Vitest globals are enabled: use `describe`, `it`, `expect`, `vi`, `beforeAll` without importing them (import only types such as `Mock` from `vitest`).
- Mock modules with `vi.mock('<path>')`; reusable mocks live in sibling `__mocks__` folders (e.g. `src/decorators/__mocks__`, `src/services/__mocks__`, `src/api/__mocks__`).
- Render with a real store from `createStore()` inside `<Provider>` and a `Router` with `createMemoryHistory` (react-router v5), as in `src/pages/dashboard/__tests__/Dashboard.test.tsx`.
- Federated remotes (`selfcareUsers/*`, `selfcareGroups/*`, `selfcareAdmin/*`) are aliased to `src/__mocks__/federation-env.tsx` in `vitest.config.ts`.
- Run one file with `yarn vitest run <path>`.
