# github-profile documentation

## Estrutura real do projeto

- `README.md`: superfície pública principal do perfil.
- `DOCUMENTATION.md`: contrato operacional e editorial usado pela CI local.
- `AGENTS.md` e `CLAUDE.md`: diretrizes equivalentes para manutenção do projeto.
- `scripts/update-readme.js`: montagem determinística do conteúdo principal.
- `scripts/update-metrics.js`: atualização dos artefatos em `metrics/`.
- `scripts/generate-pr-issue.js` e `scripts/generate-commits-streak.js`: sinais complementares usados no perfil.
- `metrics/`: diretório reservado para assets e snapshots renderizados do perfil.

## Comandos locais

```bash
npm install
npm run format:check
npm run lint
npm test
node scripts/update-readme.js
node scripts/update-metrics.js
```

## O que os checks validam

- presença de `README.md`, `DOCUMENTATION.md`, `AGENTS.md`, `CLAUDE.md`, `metrics/` e dos scripts operacionais obrigatórios;
- equivalência literal entre `AGENTS.md` e `CLAUDE.md`;
- coerência editorial do `README.md` com os links públicos e a narrativa do laboratório;
- presença das seções mínimas desta documentação para manter o contrato de CI legível;
- alinhamento com as superfícies públicas derivadas de `projects/mozgbrasil.github.io/index.html` e de `projects/node-vitepress`.

## Relação com outras superfícies

- `README.md` resume o posicionamento técnico no próprio GitHub.
- `projects/mozgbrasil.github.io/index.html` concentra a presença complementar em GitHub Pages.
- `projects/node-vitepress` concentra os dossiers públicos do laboratório e do workspace privado.
