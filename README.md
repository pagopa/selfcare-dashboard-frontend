# selfcare-dashboard-frontend 

SelfCare's application which allows users to see the parties to which belongs and their configured products:
* Admin users can list, add and edit other users.
* Admin users can list, add and edit groups of users.

**Status:** This project has been migrated from **Create React App (CRA)** to **Vite** with Module Federation support.

This application makes use of some micro-frontends built using **Vite Module Federation**.

The micro-frontends used are:
* (selfcare-dashboard-users-microfrontend)[https://github.com/pagopa/selfcare-dashboard-users-microfrontend] to handle the management of the users
* (selfcare-dashboard-groups-microfrontend)[https://github.com/pagopa/selfcare-dashboard-groups-microfrontend] to handle the management of the groups of users

## Development

### Prerequisites
- Node.js 18+ and Yarn

### Setup

1. Install dependencies:
```bash
yarn install
```

2. Start the development server:
```bash
yarn dev
```

The app will start at `http://localhost:3000` (or the port specified in `vite.config.ts`).

**Note:** Environment variables are read directly from your system environment (see [Environment Variables](#environment-variables) below).

### Available Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start Vite dev server |
| `yarn build` | Build for production (TypeScript check + Vite bundle) |
| `yarn preview` | Preview production build locally |
| `yarn test` | Run Vitest unit tests |
| `yarn test:ui` | Run Vitest with UI |
| `yarn test:coverage` | Generate test coverage report |
| `yarn lint` | Run ESLint (replaces react-scripts lint) |
| `yarn generate:api-*` | Generate API types from OpenAPI specs |

### Build Output

- **Directory:** `build/` (not `public/`)
- **Analyze:** Run `yarn build` and check `build/` folder for bundle analysis

## Environment Variables

Environment variables are read directly from your system environment at build time and at runtime. All variables must be prefixed with `VITE_` to be accessible in the browser (Vite convention).

### Setting Environment Variables

**For development:**
```bash
# Inline (one-off runs)
VITE_ENV=development VITE_URL_API_DASHBOARD=http://localhost:8080 yarn dev

# Or set in shell
export VITE_ENV=development
export VITE_URL_API_DASHBOARD=http://localhost:8080
yarn dev
```

**For CI/CD:**
Set `VITE_*` variables in your CI/CD pipeline (GitHub Actions, GitLab CI, etc.).

### Required Variables

- `VITE_ENV`: Environment (development/uat/production)
- `VITE_URL_API_DASHBOARD`: Dashboard API endpoint
- `VITE_URL_API_PARTY_REGISTRY_PROXY`: Party registry proxy API endpoint
- `VITE_URL_API_ONBOARDING_V2`: Onboarding API endpoint
- `VITE_URL_FE_LOGIN`, `VITE_URL_FE_LOGOUT`: Frontend redirect URLs
- `VITE_URL_CDN`: CDN base URL for assets
- `MICROFRONTEND_URL_USERS`, `MICROFRONTEND_URL_GROUPS`, `MICROFRONTEND_URL_ADMIN`: Micro-frontend remote URLs

## Module Federation

This application hosts multiple micro-frontends using Vite Module Federation:

- **Host config:** See `vite.config.ts` in the `federation()` plugin
- **Remotes:** Users, Groups, and Admin components are loaded dynamically
- **Shared singletons:** React, React-DOM, MUI, and PagoPA libraries are shared to avoid duplicates

For remotes to load correctly in dev:
1. Ensure remotes are running on their configured `MICROFRONTEND_URL_*` ports
2. Check browser console for federation errors
3. Verify `vite.config.ts` remote URLs match remote deployment URLs

## Migration from Create React App

This project was migrated from CRA to Vite. Key changes:

| Aspect | CRA | Vite |
|--------|-----|------|
| Dev Server | `VITE_*` via webpack env | `VITE_*` via Vite |
| Build Tool | `react-scripts` + CRACO | Vite + plugins |
| Entry Point | `src/index.js` (synchronous) | `src/index.js` + Module Federation |
| Module Federation | `craco-module-federation` | `@originjs/vite-plugin-federation` |
| Env Variables | `process.env.VITE_*` | `import.meta.env.VITE_*` |
| Type Definitions | `react-app-env.d.ts` (CRA types) | `react-app-env.d.ts` (Vite types) |

### Notes for Contributors

- **SVGR imports** are supported if `vite-plugin-svgr` is installed (see `vite.config.ts`)
- **Polyfills** are loaded before the app in `src/index.js`
- **ESLint** now uses standard configs (`@typescript-eslint/*`, `eslint-plugin-react`) instead of `react-app`
- **Tests** use `vitest` (not jest-dom specific; compatible with Jest APIs)
- **Playwright** e2e tests use the dev server or preview build (see `e2e/playwright.config.ts`)

### Removed Files/References

- ❌ `craco.config.js` → Replaced by `vite.config.ts`
- ❌ `modulefederation.config.js` (webpack) → Now in `vite.config.ts` federation plugin
- ❌ `react-scripts` dependency → Replaced by `vite` + plugins
- ❌ CRA ESLint presets (`react-app`) → Replaced by standard configs
- ✅ See `craco.config.disabled.js` for reference to the old configuration

## Data and model/types shared with remotes micro-frontend
This application represents the container app for some remotes pages/components and provide to them some shared data having shared types.

### Common models and types
#### UserStatus
An enum containing the possible onboarding status for the parties/users/products:

| Value | Description |
|-------|-------------|
| PENDING | An onboarding has been requested, but not completed |
| ACTIVE | A complete and valid onboarding |
| SUSPENDED | The relationship between party/product/user has been suspended |
| description | string | Y | The party's name |
| digitalAddress | string | Y | The party's PEC |
| fiscalCode | string | Y | The party's tax code |
| status | [UserStatus](#userstatus) | Y | The current users's onboarding status inside the party |
| userRole | [UserRole](#userrole) | Y | The user Selc role inside the party |
| category | string | N | The party's category |
| urlLogo | string | N | The party's url logo |

#### Product
It contains product's info, onboarding status and the selc role of the current user:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| id | string | Y | The product's id |
| title | string | Y | The product's name |
| description | string | Y | The product's description |
| logo | string | N | The product's logo url |
| urlBO | string | Y | The product's url to its backoffice |
| urlPublic | string | N | The product's url to an informative page |
| status | `'ACTIVE' | 'INACTIVE' | 'PENDING'` | Y | The product's onboarding status |
| userRole | [UserRole](#userrole) | N | The user Selc role for the product. Mandatory if the product is active |
| authorized | boolean | Y | If the current user is authorized to the current product |

#### ProductRole
It contains data related to one of the possible product roles

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productId | string | Y | The product's id |
| selcRole | [UserRole](#userrole) | Y | The mapped selc role |
| partyRole | [PartyRole](#partyrole) | Y | The mapped party role |
| productRole | string | Y | The product specific product role code |
| title | string | Y | The product specific product role title |
| description | string | Y | The product specific product role description |
| multiroleAllowed | boolean | Y | If true, this selcRole allow the association of more than one productRole |

#### ProductRolesLists
For a selected product, it will contains the list of its roles and some usefull aggregation

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| list | `Array<ProductRole>` | Y | The product's flat list of roles |
| groupByPartyRole | `{ [partyRole in PartyRole]: Array<ProductRole> }` | Y | The product's list of roles grouped by [PartyRole](#partyrole) |
| groupBySelcRole | `{ [selcRole in UserRole]: Array<ProductRole> }` | Y | The product's list of roles grouped by [UserRole](#userrole) |
| groupByProductRole | `{ [productRole: string]: Array<ProductRole> }` | Y | A map to transcode the productRole code to its ProductRole configuration |

### Common Props
Remote micro-components need the following Props:

#### Props to configure Micro-components
Props shared with each type of micro-components:

| Prop | Type | Mandatory | Description |
|------|------|-----------|-------------|
| history | History | Y | The react-router history used by the container app |
| theme | Theme | Y | The mui Theme used by the container app |
| store | `Store<any, any>` | Y | The react-redux store used by the container app |

#### Props to configure Dashboard Micro-frontends pages
The following props, together with the [micro-components props](#props-to-configure-micro-components) are to be provided to all the dashboard pages served by remotes micro-frontends:

| Prop | Type | Mandatory | Description |
|------|------|-----------|-------------|
| party | Party | Y | The selected [Party](#party) |
| products | `Array<Product>` | Y | The complete list of [Product](#product) related to the selected party (active and pending) in case of ADMIN user, otherwise just the authorized products |
| activeProducts | `Array<Product>` | Y | The list of active [Product](#product), also not authorized in case of ADMIN |
| productsMap | `{ [productId: string]: Product }` | Y | A map to transcode productId into a [Product](#product) |
| decorators | DashboardDecoratorsType | Y | A set of decorators that each configured Page could use in order to retrieve Parties and Products extra data |

##### decorators prop
Each decorator has the purpose to retrieve some extra data and:
- Has the type *`(WrappedComponent: React.ComponentType<any>) => React.ComponentType<any>`*
- Represents a decorator that retrieve and provide some Props to the decorated component

###### withProductRolesMap
A decorator usable by all the dashboard pages in order to provide the following Props:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productsRolesMap | `[productId: string]: ProductRolesLists` | Y | A map containing the mapping between productId and its (ProductRolesLists)[#productroleslists] |

###### withSelectedProduct
A decorator usable by the dashboard pages having *productId* as path variable in the configured route in order to provide the following Props:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| selectedProduct | Product | Y | The [Product](#product) selected through the *productId* path variable |
| fetchSelectedProductRoles | `(product: Product) => Promise<ProductRolesLists>` | Y | A function to retrieve the (ProductRolesLists)[#productroleslists] associated to the current product |

###### withSelectedProductRoles
A decorator usable by the dashboard pages after the resolution of the selected product in order to fetch immediately and serve its (ProductRolesLists)[#productroleslists]:

| Field | Type | Mandatory | Description |
|-------|------|-----------|-------------|
| productRolesList | ProductRolesLists | Y | The (ProductRolesLists)[#productroleslists] associated to the current product |

It can be combined with [withSelectedProduct](#withselectedproduct) in the following way:
`withSelectedPartyProduct(withSelectedPartyProductAndRoles(`*PageToDecorate*`))`

## To configure the workspace execute the following commands
- yarn install
- yarn generate

## To execute locally a configured workspace execute the following command
- yarn start

The remote components should be put into execution locally or use the following environment variable to customize their URL:
- MICROFRONTEND_URL_USERS
- MICROFRONTEND_URL_GROUPS
- MICROFRONTEND_URL_ADMIN

## To execute locally mocking REST invocation, modify the file .env.development.local setting
- VITE_API_MOCK_PARTIES=true
- VITE_API_MOCK_PRODUCTS=true

## To build a configured workspace execute the following command
- yarn build

## Setup Playwright for Testing

Ensure you have **Yarn** and **Node.js** installed on your machine. You can check their installation by running:
- node -v
- yarn -v
## Install Dependencies
- cd e2e
- yarn install

## Run Playwright Tests Locally
- yarn playwright test