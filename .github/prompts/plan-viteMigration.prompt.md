Plan: Migrate CRA Orchestrator to Vite

TL;DR — convert the host to Vite, move CRA-era customizations (CRACO, Module Federation config, SVGR usage, env handling, TS typings, ESLint) into a `vite.config.ts` + plugins, switch runtime config to build-time `VITE_` envs, and translate Module Federation to `@originjs/vite-plugin-federation`.

Steps
1. Discovery & safety checks
   - Confirm current scripts/build: `package.json`.
   - Inspect CRACO and MF config: `craco.config.js`, `modulefederation.config.js`.
   - Confirm entry ordering and polyfills: `src/index.js`, `src/bootstrap.tsx`.

2. Choose and implement env strategy (build-time VITE_)
   - Replace `REACT_APP_*` usage with `VITE_*` names.
   - Update `src/utils/env.ts` to read from `import.meta.env` and fallback to defaults.
   - Update CI/deploy to inject `VITE_*` envs at build time.
   - Edit `public/index.html` to remove CRA placeholders and use Vite-friendly approach.
   - Files: `src/utils/env.ts`, `public/index.html`, `package.json`.

3. Create `vite.config.ts` and plugin stack
   - Add `@vitejs/plugin-react`, `vite-tsconfig-paths`, `vite-plugin-svgr` (or `@svgr/rollup`), and `@originjs/vite-plugin-federation`.
   - Translate `modulefederation.config.js` remotes and shared to the Vite federation plugin; use `import.meta.env.VITE_MICROFRONTEND_URL_*`.
   - Recreate any alias/resolve behavior from `craco.config.js` inside `vite.config.ts`.
   - File to add: `vite.config.ts`.

4. Module Federation translation & runtime remote resolution
   - Convert webpack `remotes` to Vite-federation syntax.
   - Add dev-time fallback for remotes (local dev URLs) using `import.meta.env` or runtime loader.
   - Verify dynamic imports like `import('selfcareAdmin/RoutingAdmin')` work.
   - Files: `modulefederation.config.js` (reference), `vite.config.ts`, `src/microcomponents/admin/RemoteRoutingAdmin.tsx`.

5. Preserve polyfills & boot order
   - Ensure `@pagopa/selfcare-common-frontend/lib/common-polyfill` loads before app code with Vite.
   - Keep import in `src/index.js` or load via `index.html` script tag if necessary.

6. Keep SVGR usage
   - Add `vite-plugin-svgr` so `import { ReactComponent as X } from './x.svg'` continues to work.
   - Verify example: `src/pages/dashboardDocumentsDetail/DashboardDocumentsDetailPage.tsx`.

7. Type and lint updates
   - Replace `src/react-app-env.d.ts` CRA references with Vite TS typings: declare `ImportMetaEnv` and `ImportMeta`.
   - Update ESLint config to remove CRA presets; adopt `eslint-plugin-react` / `@typescript-eslint` rules as needed.
   - Files: `src/react-app-env.d.ts`, `package.json` eslintConfig.

8. Tests & e2e
   - Verify `vitest` setup: ensure `src/setupTests.ts` is compatible with Vitest.
   - Update Playwright `e2e/playwright.config.ts` to use `npm run dev` for `webServer` if integrated e2e runs desired.
   - Files: `src/setupTests.ts`, `e2e/playwright.config.ts`.

9. Service worker / Workbox check
   - Inspect CI/deploy scripts and infra to see if Workbox SW generation is used; if so, add Vite-friendly Workbox post-build step or plugin.
   - Files to inspect: `Dangerfile.ts`, `infra/`, CI pipeline definitions.

10. Clean-up and remove CRA artifacts
    - Remove or ignore `craco.config.js` and CRACO-only packages.
    - Remove references to `react-scripts`, `%PUBLIC_URL%`, and CRA lockfile-only expectations.
    - Update README and contributor docs about new dev commands.
    - Files: `craco.config.js` (remove), `public/index.html`.

11. Verification & rollout
    - Dev: run `npm run dev` and validate local dev server, MF remotes, and assets.
    - Build: run `npm run build`, then `npm run preview` to validate production build.
    - Test: run `npm run test` (vitest) and Playwright e2e against preview server.
    - Smoke-check: run host + remotes locally to confirm remote routing and shared singletons behave.

Verification commands
- Dev server
```bash
npm run dev
```
- Build and preview
```bash
npm run build
npm run preview
```
- Tests
```bash
npm run test
npm run test:coverage
```

Decisions made
- Env approach: Convert to build-time `VITE_*` envs (chosen).
- Module Federation: Translate to `@originjs/vite-plugin-federation` now (remotes will be migrated to Vite).
- Service Worker: Will inspect CI/deploy to decide migration path.

High-impact files to edit/create
- Edit: `src/utils/env.ts`, `public/index.html`, `src/react-app-env.d.ts`, `craco.config.js` (remove), `modulefederation.config.js` (translate/consult)
- Create: `vite.config.ts`
- Add deps/plugins: `@vitejs/plugin-react`, `@originjs/vite-plugin-federation`, `vite-tsconfig-paths`, `vite-plugin-svgr`

Next actions
- Implement the Vite config and `src/utils/env.ts` changes (I can prepare diffs/patches).
- Inspect CI/deploy for service worker usage before removing Workbox references.

Notes
- Keep `src/index.js` bootstrap ordering to ensure polyfills load first.
- `vitest`/`jest` mixing must be validated; convert setup if necessary.
- Ensure shared singletons versions match across host and remotes.

End of plan.
