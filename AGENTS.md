# Local Agent Guidelines

## Project Context

- name: `github-profile`
- path: `projects/github-profile`
- runtime: `nodejs`
- matrix checks: format=`true`, lint=`true`, test=`true`

## Runtime Commands

- `npm install`
- `npm run format:check`
- `npm run lint`
- `npm test`

## Maintenance Rules

- O workspace `monorepo` e privado; o README publico deve apontar para `mozg.com.br`, `mozgbrasil.github.io`, perfil GitHub, Google Play e dossiers publicos, nunca para uma URL privada do repositório.
- Mantenha coerencia editorial entre `README.md`, `DOCUMENTATION.md`, `projects/mozgbrasil.github.io` e `projects/node-vitepress`.
- Mantenha `AGENTS.md` e `CLAUDE.md` equivalentes.

## CI Notes

- Este projeto é governado por `.github/matrix.json`.
- Valide matriz e documentação com `npm run matrix:check`.
