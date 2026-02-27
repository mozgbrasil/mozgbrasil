# github-profile

Scripts de automação para checagens de perfil/README e rotinas auxiliares.

## Requisitos

- Node.js 22+
- npm 8+

## Instalação

```bash
npm install
```

## Qualidade

```bash
npm run format:check
npm run lint
npm test
```

## Estrutura principal

- `scripts/` scripts de automação e checks
- `metrics/` artefatos/insumos de métricas

## CI e deploy

Na matriz do monorepo este projeto roda com `format`, `lint` e `test` habilitados.
O deploy de Pages publica o diretório raiz do projeto (`dist_dir: .`).

---

Desenvolvido pela [Mozg Brasil](https://mozg.com.br)
