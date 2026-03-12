# Local Agent Guidelines

## Project Context

- name: `github-profile`
- path: `projects/github-profile`
- runtime: `nodejs`
- matrix checks: format=`true`, lint=`true`, test=`true`

## Runtime Commands

- `npm install`
- `npm run lint`
- `npm test`

## CI Notes

- Este projeto é governado por `.github/matrix.json`.
- Valide matriz e documentação com `npm run matrix:check`.
- Mantenha `AGENTS.md` e `CLAUDE.md` equivalentes.
