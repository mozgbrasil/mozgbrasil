# Documentação do GitHub Profile Automation

## 📌 Visão Geral

O GitHub Profile Automation é uma ferramenta poderosa para aprimorar e automatizar o perfil do GitHub com métricas dinâmicas, conquistas e visualizações interativas. Ele é projetado para funcionar como um projeto autônomo dentro do monorepo, utilizando GitHub Actions para atualizações periódicas.

## 🏗️ Estrutura do Projeto

```
github-profile/
├── .github/
│   └── workflows/      # Fluxos de trabalho do GitHub Actions
├── metrics/           # Dados e métricas coletadas
├── scripts/           # Scripts de automação
│   ├── achievements.js # Lógica de conquistas
│   ├── metrics.js     # Coleta de métricas
│   └── update.js      # Atualização do README
├── .env.example      # Exemplo de variáveis de ambiente
├── package.json      # Dependências e scripts
└── README.md         # Documentação principal
```

## 🚀 Funcionalidades Principais

### 1. Métricas Automatizadas

- Estatísticas de contribuição
- Gráficos de atividade
- Análise de linguagens
- Metas de contribuição

### 2. Sistema de Conquistas

- Badges por marcos atingidos
- Desafios semanais/mensais
- Recompensas por consistência

### 3. Dashboards Interativos

- Visualização de commits
- Análise de produtividade
- Comparativo com períodos anteriores

## ⚙️ Configuração

### Pré-requisitos

- Node.js 16+
- Conta no GitHub
- Token de acesso pessoal com permissões:
  - `repo` (para repositórios privados)
  - `user:email`
  - `read:user`

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/mozgbrasil/monorepo.git
   cd monorepo/projects/github-profile
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o .env com suas credenciais
   ```

## 🛠️ Uso

### Comandos Disponíveis

```bash
# Executar coleta de métricas
npm run metrics

# Atualizar README com as métricas mais recentes
npm run update

# Executar testes
npm test

# Verificar qualidade do código
npm run lint
```

### GitHub Actions

O fluxo de trabalho está configurado para rodar diariamente. Você pode personalizar a frequência em `.github/workflows/update.yml`.

## 🔄 Atualização

### Adicionando Novas Métricas

1. Crie um novo script em `scripts/`
2. Adicione a lógica de coleta de dados
3. Atualize `update.js` para incluir as novas métricas
4. Atualize o template do README se necessário

### Personalizando Conquistas

Edite `scripts/achievements.js` para adicionar ou modificar conquistas. Cada conquista deve ter:

- Um identificador único
- Título e descrição
- Condição para desbloqueio
- Badge personalizado (opcional)

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/incrivel`)
3. Commit suas alterações (`git commit -am 'Adiciona feature incrível'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, por favor abra uma [issue](https://github.com/mozgbrasil/monorepo/issues) ou entre em contato via [email](mailto:suporte@mozg.com.br).

---

📅 **Última Atualização**: Setembro de 2025  
🏷 **Versão**: 1.0.0
