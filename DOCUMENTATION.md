# Documentacao do GitHub Profile

## Visao geral

`github-profile` concentra o material publico usado para o perfil do GitHub:
README principal, scripts de atualizacao de metricas e checks locais de
consistencia. O projeto funciona como um ponto de resumo da identidade tecnica
publica e precisa permanecer coerente com `mozg.com.br` e
`mozgbrasil.github.io`.

## Estrutura real do projeto

```text
github-profile/
├── README.md
├── DOCUMENTATION.md
├── package.json
├── scripts/
│   ├── build.sh
│   ├── ci-checks.js
│   ├── deploy.sh
│   ├── generate-commits-streak.js
│   ├── generate-pr-issue.js
│   ├── startup.sh
│   ├── update-metrics.js
│   └── update-readme.js
└── metrics/
```

## Responsabilidades

- manter o README do perfil claro, legivel e coerente com os outros canais publicos
- reunir scripts de apoio para geracao ou atualizacao de metricas
- oferecer checks locais simples para scripts, documentacao e baseline estrutural

## Comandos locais

```bash
npm install
npm run format:check
npm run lint
npm test
```

## O que os checks validam

- existencia dos arquivos obrigatorios
- parse basico dos scripts JavaScript via `node --check`
- coerencia entre `AGENTS.md` e `CLAUDE.md`
- presenca das secoes essenciais no `README.md` e na `DOCUMENTATION.md`

## Coerencia entre canais

Os seguintes pontos devem se manter alinhados:

- `projects/github-profile/README.md`
- `projects/mozgbrasil.github.io/index.html`
- `projects/mozgbrasil.github.io/README.md`

O objetivo nao e duplicar texto palavra por palavra, e sim manter a mesma
linguagem, os mesmos links principais e o mesmo nivel de metadados publicos.

O workspace fonte do monorepo e privado no GitHub. Por isso, as superficies
publicas devem sempre privilegiar:

- sites publicados;
- perfil GitHub publico;
- perfil de desenvolvedor no Google Play;
- dossiers publicos em `mozg.com.br/projetos/*`.

## Presenca mobile de desenvolvedor

As informacoes de aplicativo tambem devem permanecer coerentes entre:

- `projects/github-profile/README.md`
- `projects/mozgbrasil.github.io/README.md`
- `projects/node-vitepress` (seções de presença/projetos)

Checklist recomendado:

- manter o link do perfil de desenvolvedor do Google Play em todas as superfícies
- distinguir o app **Mozg TWA** (Bubblewrap) e o **Mozg Híbrido** (Angular) como ativos ativos
- evitar links para `github.com/mozgbrasil/monorepo` em conteúdo público
