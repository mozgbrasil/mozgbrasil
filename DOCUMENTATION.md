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
bash scripts/build.sh
bash scripts/build.sh test-only
npm run surface:json
npm run matrix:check
node scripts/update-readme.js
node scripts/update-metrics.js
```

## Contrato operacional minimo

O projeto mantém um snapshot editorial em `scripts/profile-surface.js` com
`request_id`, `x_request_timestamp`, `x_request_path` e `x_request_method`
para auditoria local da superfície pública.

## O que os checks validam

- presença de `README.md`, `DOCUMENTATION.md`, `AGENTS.md`, `CLAUDE.md`, `metrics/` e dos scripts operacionais obrigatórios;
- equivalência literal entre `AGENTS.md` e `CLAUDE.md`;
- coerência editorial do `README.md` com os links públicos e a narrativa do laboratório;
- presença da seção `Skills em foco` e dos perfis públicos prioritários usados como prova social e rastreabilidade externa;
- presença das seções mínimas desta documentação para manter o contrato de CI legível;
- execucao ordenada do contrato de testes em `tests/00-profile-contract.test.js`;
- contrato operacional mínimo do snapshot `npm run surface:json`;
- alinhamento com as superfícies públicas derivadas de `projects/mozgbrasil.github.io/index.html` e de `projects/node-vitepress`.

## Relação com outras superfícies

- `README.md` resume o posicionamento técnico no próprio GitHub.
- `projects/mozgbrasil.github.io/index.html` concentra a presença complementar em GitHub Pages.
- `projects/node-vitepress` concentra os dossiers públicos do laboratório e do workspace privado.
