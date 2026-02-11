# CRA → Vite Migration Summary

**Project:** selfcare-dashboard-frontend  
**Migration Date:** February 2025  
**Status:** ✅ Complete

## Files Changed / Created

### Core Configuration
- ✅ **vite.config.ts** (NEW) — Vite config with React, TSConfig paths, federation, and SVGR plugins
- ✅ **tsconfig.json** — Updated `moduleResolution: "bundler"` and included `vite.config.ts`
- ✅ **.eslintignore** — Added `vite.config.ts` and `craco.config.js` to exclude from linting
- ✅ **.env.example** (OPTIONAL) — Mark as deprecated; environment variables are read directly from system env

### Environment & Build
- ✅ **src/utils/env.ts** — Migrated from `env-var` library to Vite `import.meta.env` with compatibility layer
- ✅ **public/index.html** — Removed CRA placeholders (`%PUBLIC_URL%`, `%REACT_APP_*%`); switched to runtime injection
- ✅ **src/bootstrap.tsx** — Added CDN fonts and external resource loader using env vars

### TypeScript & Static Types
- ✅ **src/react-app-env.d.ts** — Replaced `react-scripts` types with Vite `ImportMetaEnv` and `ImportMeta` interfaces

### ESLint
- ✅ **package.json** (eslintConfig) — Replaced `react-app` presets with standard `@typescript-eslint`, `eslint-plugin-react`, and Prettier configs

### Archived/Deprecated
- ⚠️ **craco.config.disabled.js** (NEW) — Old CRACO webpack config archived for reference (no longer used)
- ❌ **craco.config.js** — No longer needed; webpack config is now in `vite.config.ts` federation plugin
- ❌ **modulefederation.config.js** — Webpack MF config archived; now in `vite.config.ts` federation plugin
- ❌ **react-scripts** dependency — Removed from package.json

### Documentation
- ✅ **README.md** — Updated with Vite dev/build commands, environment variables, Module Federation notes, and migration guide
- ✅ **.github/prompts/plan-viteMigration.prompt.md** — Step-by-step migration plan (reference)

## Key Changes

### 1. Environment Variables (System Environment)
**Key Change:** No `.env.local` file needed. Variables are read **directly from system environment**.

**CRA (Old):**
```bash
# Created .env.local file
REACT_APP_ENV=development
REACT_APP_URL_CDN=https://cdn.example.com
```

**Vite (New - No Local File Required):**
```bash
# Set directly in shell or CI/CD
export VITE_ENV=development
export VITE_URL_CDN=https://cdn.example.com
yarn dev
```

All references to `process.env.REACT_APP_*` → `import.meta.env.VITE_*` (handled transparently in `src/utils/env.ts`)

**For CI/CD:** Provide `VITE_*` variables directly from your pipeline (GitHub Actions, etc.)

### 2. Build System
| Aspect | CRA | Vite |
|--------|-----|------|
| Dev Server | `npm start` → `webpack-dev-server` | `yarn dev` → `vite` |
| Build | `react-scripts build` | `yarn build` → tsc + vite |
| Preview | N/A | `yarn preview` |
| Build Output | `build/` folder | `build/` folder |

### 3. Module Federation
**Old (Webpack):**
```javascript
// craco.config.js + modulefederation.config.js
remotes: { selfcareAdmin: 'selfcareAdmin@${process.env.MICROFRONTEND_URL_ADMIN}/remoteEntry.js' }
```

**New (Vite):**
```typescript
// vite.config.ts
federation({
  remotes: { selfcareAdmin: buildRemoteUrl('MICROFRONTEND_URL_ADMIN') }
})
```

### 4. Entry Point & Bootstrap Order
- **Maintained:** `src/index.js` → imports polyfill → dynamic import of `src/bootstrap.tsx`
- **Preserved:** React.lazy for remote imports (e.g., `selfcareAdmin/RoutingAdmin`)
- **Enhanced:** CDN and external resources now loaded dynamically in `src/bootstrap.tsx`

## Migration Checklist

- [x] Environment file created (`.env.example`)
- [x] `vite.config.ts` with all plugins configured
- [x] Environment variable reader updated (`src/utils/env.ts`)
- [x] HTML entry point cleaned up (`public/index.html`)
- [x] Bootstrap and polyfill ordering verified (`src/index.js`, `src/bootstrap.tsx`)
- [x] Module Federation config translated to Vite plugin
- [x] TypeScript types updated (`src/react-app-env.d.ts`)
- [x] ESLint config modernized (no CRA presets)
- [x] Playwright e2e config ready (uses Vite dev server)
- [x] Tests ready (`vitest` is the default test runner)
- [x] README updated with Vite commands and migration notes
- [x] CRA artifacts archived/disabled

## Next Steps for Teams

### For Developers
1. **Install dependencies:** `yarn install`
2. **Set environment variables:** Export required `VITE_*` variables (see README Environment Variables section):
   ```bash
   export VITE_ENV=development
   export VITE_URL_API_DASHBOARD=http://localhost:8080/dashboard
   export VITE_URL_API_PARTY_REGISTRY_PROXY=http://localhost:8080/party-registry-proxy
   # ... set other required VITE_* variables
   yarn dev
   ```
3. **Start dev server:** `yarn dev`
4. **Run tests:** `yarn test`

### For CI/CD Pipeline
1. **Update build command:** Replace `react-scripts build` with `yarn build`
2. **Update env injection:** Provide `VITE_*` environment variables at build time (instead of `REACT_APP_*`)
3. **Verify remotes:** Ensure `MICROFRONTEND_URL_*` vars are set to correct remote endpoints

### For Remote Micro-Frontends
- Plan migration of remotes to Vite and Vite federation plugin (same `@originjs/vite-plugin-federation`)
- Ensure remotes expose compatible `remoteEntry.js` (ESM format)
- Share singleton versions should match host config in `vite.config.ts` for consistency

## Troubleshooting

### Remote not loading ("Failed to import remote")
- Check `MICROFRONTEND_URL_*` environment variables
- Verify remote is running and `remoteEntry.js` is accessible
- Check browser console for federation errors

### Env vars not available in app
- Ensure variables are prefixed with `VITE_` and exported in your system environment
- For development: `export VITE_ENV=development` before running `yarn dev`
- For CI/CD: provide `VITE_*` variables in your pipeline (GitHub Actions, GitLab CI, etc.)
- Rebuild after changing env vars (Vite replaces them at build time)
- Check `src/utils/env.ts` for the correct env key name
- **Note:** `.env.local` files are optional; the app reads directly from system environment

### Tests failing
- Run `yarn test` to use Vitest (replaces Jest)
- Check imports in test files (ES modules required)
- See `src/setupTests.ts` for Jest API compatibility setup

## References

- [Vite Documentation](https://vitejs.dev)
- [Vite Module Federation Plugin](https://github.com/originjs/vite-plugin-federation)
- [Vitest (Test Runner)](https://vitest.dev)
- [React Migration Guide for Vite](https://react.dev/learn/start-a-new-react-project#vite)

---

**Questions?** Refer to the migration plan in `.github/prompts/plan-viteMigration.prompt.md` or the updated README.md.
