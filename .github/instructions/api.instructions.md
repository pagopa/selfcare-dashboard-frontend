---
applyTo: "src/api/**,openApi/**"
---

- `src/api/generated/` and `openApi/generated-*` are build output (gitignored). Never edit them; change `openApi/*-api-docs.json` or `openApi/scripts/*` and run `yarn generate`.
- Call the backend only through `DashboardApiClient.ts` / `PartyRegistryProxyApiClient.ts`, and from components only via `src/services/*`.
- Add a matching mock in `src/api/__mocks__/DashboardApiClient.ts` for every new client method.
