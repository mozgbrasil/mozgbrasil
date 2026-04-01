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
- `npm run surface:md`
- `npm run surface:ready`
- `npm run surface:links`
- `npm run surface:links:ndjson`
- `npm run metrics:dry-run`
- `bash scripts/build.sh surface-only`
- `bash scripts/build.sh ready-only`
- `npm run matrix:check`

## Maintenance Rules

- O workspace `monorepo` e privado; o README público deve apontar para `mozg.com.br`, `mozgbrasil.github.io`, perfil GitHub, Google Play e dossiers públicos, nunca para uma URL privada do repositório.
- Mantenha coerência editorial entre `README.md`, `DOCUMENTATION.md`, `projects/mozgbrasil.github.io` e `projects/node-vitepress`.
- Preserve `.tool-versions` alinhado ao Node local validado no host.
- Preserve o contrato mínimo do snapshot `surface:json` com `request_id`, `x_request_timestamp`, `x_request_path` e `x_request_method`.
- Preserve também `api_version` e `audit_headers` explícitos no snapshot `surface:json`, na documentação local e nos testes.
- Preserve também os filtros explícitos por `category`, `host`, `section`, `search` e `limit`, alem das exportacoes `json`, `md` e `ndjson`.
- Mantenha o snapshot de readiness local com status determinístico e checks pequenos para arquivos, secoes e superfícies públicas obrigatórias.
- Preserve a trilha de métricas com `User-Agent`, timeout, `metrics/manifest.json` e `--dry-run` não mutante para validação local.
- Mantenha `AGENTS.md` e `CLAUDE.md` equivalentes.

## CI Notes

- Este projeto é governado por `.github/matrix.json`.
- Prefira `bash scripts/build.sh all` como gate local e `npm run check` quando quiser a agregacao via `package.json`.
- Valide matriz e documentação com `npm run matrix:check`.
