# Local Agent Guidelines

## Project Context

- name: `mozgbrasil.github.io`
- path: `projects/mozgbrasil.github.io`
- runtime: `none`
- matrix checks: format=`false`, lint=`false`, test=`false`

## Runtime Commands

- `# projeto estático sem runtime de build local`

## CI Notes

- Este projeto é governado por `.github/matrix.json`.
- Valide matriz e documentação com `npm run matrix:check`.
- Mantenha `AGENTS.md` e `CLAUDE.md` equivalentes.
