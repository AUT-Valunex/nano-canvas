# Nano Canvas – AGPL Launch Checklist

## Licensing & Compliance
- [x] Replace MIT license with full AGPLv3 text and update every reference (README, CONTRIBUTING, package.json, templates).
- [x] Add AGPL §13 network-source notice in UI and documentation.
- [x] Create `NOTICE.md` summarising third-party licensing and analytics usage.

## Repository Hygiene
- [x] Remove private deployment artefacts and logs (`.vercel/`, `test-results/`) and update `.gitignore`.
- [x] Standardise on pnpm by removing `bun.lock` and `package-lock.json`.
- [x] Ensure `dist/` remains untracked and excluded from releases.

## Product & Privacy
- [x] Remove Vercel analytics from the open-source build and document deployment-specific integrations.
- [x] Align CSP with font strategy (self-host or whitelist Google Fonts hosts).
- [x] Add `SECURITY.md` with disclosure process and link it from README/CONTRIBUTING.

## Documentation Polish
- [x] Replace placeholder names, emails, and asset links across docs.
- [x] Expand README/USAGE with contributor testing/linting workflow and analytics/privacy notes.
- [ ] Refresh CHANGELOG and README visuals once assets are final.
