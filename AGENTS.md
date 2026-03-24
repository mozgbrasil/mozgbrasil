# Local Agent Guidelines

## Project Context

- name: `github-profile`
- path: `projects/github-profile`
- runtime: `nodejs`
- matrix checks: format=`true`, lint=`true`, test=`true`

## Runtime Commands

- `npm install`
- `bash scripts/build.sh format-only`
- `bash scripts/build.sh lint-only`
- `bash scripts/build.sh test-only`
- `bash scripts/build.sh all`
- `npm run format:check`
- `npm run lint`
- `npm test`
- `npm run check`
- `npm run surface:json`
- `npm run matrix:check`

## Maintenance Rules

- O workspace `monorepo` e privado; o README publico deve apontar para `mozg.com.br`, `mozgbrasil.github.io`, perfil GitHub, Google Play e dossiers publicos, nunca para uma URL privada do repositório.
- Mantenha coerencia editorial entre `README.md`, `DOCUMENTATION.md`, `projects/mozgbrasil.github.io` e `projects/node-vitepress`.
- Preserve `.tool-versions` alinhado ao Node local validado no host.
- Preserve o contrato mínimo do snapshot `surface:json` com `request_id`, `x_request_timestamp`, `x_request_path` e `x_request_method`.
- Mantenha `AGENTS.md` e `CLAUDE.md` equivalentes.

## CI Notes

- Este projeto é governado por `.github/matrix.json`.
- Prefira `bash scripts/build.sh all` como gate local e `npm run check` quando quiser a agregacao via `package.json`.
- Valide matriz e documentação com `npm run matrix:check`.
