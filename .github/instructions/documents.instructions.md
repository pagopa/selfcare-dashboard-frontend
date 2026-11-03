---
applyTo: "src/pages/documents/**,src/model/ContractUpdate.ts,src/services/contractUpdateService.ts"
---

For the section overview (routes, flow, where things live) read the "Documents section" in `README.md`.

- Contract update dialogs must reuse `contractUpdate/components/ContractUpdateConfirmDialog` (title, message, close X, secondary text button, primary button); create a thin wrapper per dialog instead of a new `Dialog`.
- The wizard draft stays in `ContractUpdateWizardContext` (reducer). Do not move it to Redux or storage. Change state only through reducer actions, and add new steps to `CONTRACT_UPDATE_STEPS` plus `steps/index.ts` (component and, if the step has inputs, validator).
- Domain types (`LegalRepresentative`, `Admin`, `ContractUpdateDraft`) and `getVisibleAdmins` live in `src/model/ContractUpdate.ts`. Services must not import from `src/pages`.
- Read `DASHBOARD_ROUTES` inside components, not at module level: `routes.tsx` imports these pages (circular import). For contract update routes prefer `ENV.ROUTES.CONTRACT_UPDATE*` with `resolvePathVariables`.
- When opening the wizard from another page, pass `{ returnTo: pathname + search + hash }` as location state so Back returns there.
- Leave the wizard with `history.replace` to the result pages so Back does not reopen a submitted draft.
- The success page must never propose the product just submitted (its update is processed asynchronously and may still be required), nor products with an update in progress: this prevents an endless loop.
- Translations: wizard keys are under `contractUpdateWizard.*`, documents page keys under `documents.*`; add them to all five locale files.
- Tests: `contractUpdate/__tests__/ContractUpdateWizard.test.tsx` covers navigation, dialogs and result pages; mock `contractUpdateService` there instead of the API client.
