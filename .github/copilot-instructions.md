# Copilot Instructions

React 18 + TypeScript + Vite container ("host") app for the SelfCare dashboard. It is served under the base path `/dashboard` and loads the users, groups and admin micro-frontends at runtime via Module Federation.

## Commands

Use Yarn (Node version in `.node-version`).

```
yarn install
yarn generate          # required before first build/start/test: generates src/api/generated/* from openApi/*.json
yarn start             # vite dev server on :3000
yarn build             # tsc && vite build (prebuild runs generate)
yarn lint              # eslint (use yarn lint-autofix to fix)
yarn typecheck         # tsc --noEmit
yarn prettify
yarn test              # vitest run (all tests)
yarn test:coverage
```

Run a single test file or test name:

```
yarn vitest run src/pages/dashboard/__tests__/Dashboard.test.tsx
yarn vitest run -t "partial test name"
```

E2E (Playwright) lives in `e2e/` with its own `package.json`; it is excluded from vitest. Run with `cd e2e && yarn playwright test`.

CI (`.github/workflows/code_review.yaml`) runs build, lint, Danger and `test:coverage`.

## Architecture

- **Module Federation host** (`vite.config.ts`): remotes `selfcareUsers`, `selfcareGroups`, `selfcareAdmin` are resolved from `MICROFRONTEND_URL_USERS|GROUPS|ADMIN` env vars. Shared singletons (react, mui, redux, router, i18next, `@pagopa/selfcare-common-frontend`, `@pagopa/mui-italia`) are declared there; adding a shared dependency requires registering it in that `shared` block.
- `src/microcomponents/*` wraps each remote (e.g. `RemoteRoutingUsers`) and the host passes shared data/callbacks to them as props. Prop types for each remote are declared in the `selfcare*.d.ts` files next to the wrappers and derive from `dashboardMicrocomponentsUtils.ts`. The shared model types (`Party`, `Product`, `ProductRole`, `UserRole`, ...) and prop contracts are documented in `README.md`. These types are copied (not imported) in each repo, so if you change `Party`, `Product`, `ProductRole` or the props passed to a remote, apply the same change to the remote repos (`selfcare-dashboard-users-microfrontend`, `selfcare-dashboard-groups-microfrontend`, `selfcare-dashboard-admin-microfrontend`) and to `selfcare-pnpg-dashboard-frontend` (uses only users and groups).
- **Routing** (`src/routes.tsx`): react-router v5 (`Redirect`, `useParams`, not v6). Routes are a `RouteConfig` object map with flags `withProductRolesMap`, `withSelectedProduct`, `withSelectedProductRoles`; these select the HOCs in `src/decorators/` (`withParties`, `withSelectedParty`, `withSelectedPartyProduct`, ...) that load data into redux before rendering the page. Paths are built from `BASE_ROUTE` (`ENV.PUBLIC_URL`).
- **Data flow**: page/hook → `src/services/*` → `src/api/DashboardApiClient.ts` / `PartyRegistryProxyApiClient.ts` (wrap the generated clients, add bearer token and error handling) → redux slices in `src/redux/slices` (`partiesSlice`, `adminRolesSlice`).
- **Generated API code**: `src/api/generated/` is gitignored and produced by `yarn generate` from `openApi/dashboard-api-docs.json` and `openApi/party-registry-proxy-api-docs.json` (OpenAPI 3 → Swagger 2 → `gen-api-models`, with pre/post fix scripts in `openApi/scripts/`). To pick up API changes, update the spec JSON and re-run `yarn generate`; never edit generated files.
- **Mocking**: `src/api/__mocks__/DashboardApiClient.ts` and `src/services/__mocks__` back both tests and local mock mode (`VITE_API_MOCK_PARTIES`, `VITE_API_MOCK_PRODUCTS` in `.env.development.local`).
- **Env**: all runtime config goes through `src/utils/env.ts` from `VITE_*` variables (only `VITE_`-prefixed vars are exposed via `process.env`).
- **i18n**: translations are in `src/locale/{it,en,fr,sl,de}.ts` and registered in `src/locale/index.ts` via `configureI18n`. Add new keys to every language file.
- Shared UI, utilities, redux helpers and i18n setup come from `@pagopa/selfcare-common-frontend` and `@pagopa/mui-italia` (design system); prefer them over reimplementing.

## Testing conventions

- Vitest + jsdom + Testing Library, globals enabled (`describe/it/expect` without imports), setup in `src/setupTests.ts`.
- `vitest.config.ts` aliases the remote modules (`selfcareUsers/RoutingUsers`, etc.) to `src/__mocks__/federation-env.tsx`; remote imports must keep matching those alias names or tests fail to resolve.
- Tests live in `__tests__` folders next to the code; render helpers are in `src/utils/test-utils.tsx`.

## Conventions

- Prettier (`.prettierrc`) and ESLint (`.eslintrc.js`, includes `sonarjs` and `functional` plugins) are enforced in CI; run `yarn lint` before finishing.
- PRs use `.github/PULL_REQUEST_TEMPLATE.md` (list of changes, motivation, screenshots, checklist).
