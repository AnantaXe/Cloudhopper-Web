# Cloudhopper Web

Cloudhopper is a migration operations workspace frontend. It includes the operational overview, discovery and asset inventory, dependency exploration, risk/readiness, architecture comparison, migration waves, IaC review, execution monitoring, approvals context, validation, reports, agent runs, feedback, audit, and connection settings.

## Run locally

```sh
npm install
npm run dev
```

## Data boundary

The repository does not include a backend contract. Current screens consume typed interfaces from `src/types/domain.ts` through `src/api/migration-api.ts`; that module currently selects a clearly labeled demo adapter backed by isolated records in `src/data/demo-data.ts`. Replace the adapter when service contracts are available. Migration actions, approval decisions, IaC validation, report exports, and live agent state are not connected or represented as successful operations.

## Verify

```sh
npm test
npm run build
```