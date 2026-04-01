# github-profile documentation

## Estrutura real do projeto

- `README.md`: superfície pública principal do perfil.
- `DOCUMENTATION.md`: guia de manutenção local e contrato editorial usado pela CI.
- `AGENTS.md` e `CLAUDE.md`: diretrizes equivalentes para manutenção do projeto.
- `scripts/update-readme.js`: sincronizador opcional de bloco gerenciado para métricas, seguro por padrão.
- `scripts/update-metrics.js`: atualização dos artefatos em `metrics/`.
- `scripts/generate-pr-issue.js` e `scripts/generate-commits-streak.js`: sinais complementares usados no perfil.
- `scripts/metrics-runtime.js`: contexto compartilhado de request, timeout, `User-Agent`, manifest e modo `--dry-run`.
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
npm run surface:md
npm run surface:ready
npm run surface:links
npm run surface:links:ndjson
npm run metrics:dry-run
npm run matrix:check
node scripts/update-readme.js
node scripts/update-metrics.js
```

## Contrato operacional minimo

## Snapshot local para manutenção

O projeto mantém um snapshot editorial em `scripts/profile-surface.js` com
`request_id`, `x_request_timestamp`, `x_request_path`, `x_request_method` e
`api_version` para auditoria local da superfície pública.

O mesmo snapshot também expõe:

- `api_version`: `2026.03`
- `audit_headers`: `request_id`, `x_request_timestamp`, `x_request_path`, `x_request_method` e `api_version`
- `supported_filters`: `category`, `host`, `section`, `search`, `limit` e `status`
- `export_formats`: `json`, `md` e `ndjson`
- `readiness_path`: `/ready`
- `surface:links:ndjson`: exportação explícita da malha pública em linhas independentes
- `surface:ready`: resumo de readiness com checks pequenos e determinísticos
- `metrics:dry-run`: execução não mutante da esteira de métricas com manifest planejado
- `metrics/manifest.json`: trilha auditável com `request_id`, `generated_at`, fingerprint e artefatos produzidos

## O que os checks validam

- presença de `README.md`, `DOCUMENTATION.md`, `AGENTS.md`, `CLAUDE.md`, `metrics/` e dos scripts operacionais obrigatórios;
- equivalência literal entre `AGENTS.md` e `CLAUDE.md`;
- coerência editorial do `README.md` com os links públicos e a narrativa do laboratório;
- presença da seção `Skills em foco` e dos perfis públicos prioritários usados como prova social e rastreabilidade externa;
- presença das seções mínimas desta documentação para manter o contrato de CI legível;
- execucao ordenada do contrato de testes em `tests/00-profile-contract.test.js`;
- contrato local do snapshot `npm run surface:json`;
- filtros e exportações explícitas de `npm run surface:links` e `npm run surface:links:ndjson`;
- readiness local em `/ready` via `npm run surface:ready`;
- qualidade do contrato editorial via ordem mínima das seções em `README.md` e `DOCUMENTATION.md`;
- trilha de métricas com `User-Agent`, timeout, manifest e `--dry-run` não mutante;
- alinhamento com as superfícies públicas derivadas de `projects/mozgbrasil.github.io/index.html` e de `projects/node-vitepress`.

## Relação com outras superfícies

- `README.md` resume o posicionamento público no próprio GitHub.
- `projects/mozgbrasil.github.io/index.html` concentra a presença complementar em GitHub Pages.
- `projects/node-vitepress` concentra os dossiers públicos do laboratório.
