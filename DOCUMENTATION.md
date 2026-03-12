# Documentação do Site Mozg Brasil

## 🌐 Visão Geral

O site da Mozg Brasil é construído com tecnologias web modernas para fornecer
uma experiência rápida, acessível e responsiva. Este documento descreve a
estrutura, configuração e processos de desenvolvimento do site.

## 🏗️ Estrutura do Projeto

```
mozgbrasil.github.io/
├── .github/           # Configurações do GitHub
│   └── workflows/     # Fluxos de CI/CD
├── assets/            # Arquivos estáticos
│   ├── css/          # Folhas de estilo
│   ├── img/          # Imagens e ícones
│   └── js/           # Scripts JavaScript
├── .nojekyll         # Desativa o processamento Jekyll
├── index.html        # Página principal
├── manifest.json     # Configuração do PWA
└── sitemap.xml      # Mapa do site para SEO
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização responsiva
- **JavaScript** - Interatividade
- **GitHub Pages** - Hospedagem
- **GitHub Actions** - CI/CD
- **PWA** - Suporte a Progressive Web App

## 🚀 Guia de Desenvolvimento

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Git para controle de versão
- Node.js (opcional para desenvolvimento local)
- Editor de código (VS Code recomendado)

### Configuração do Ambiente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/mozgbrasil/monorepo.git
   cd monorepo/projects/mozgbrasil.github.io
   ```

2. **Servidor de desenvolvimento local**

   ```bash
   # Usando Python (simples)
   python3 -m http.server 8000

   # Ou com live-server (instale via npm)
   npx live-server --port=8000
   ```

3. **Acesse** Abra `http://localhost:8000` no navegador.

## 🛠️ Estrutura de Arquivos

### Páginas Principais

- `index.html` - Página inicial
- `404.html` - Página de erro 404

### Assets

- `assets/css/` - Estilos CSS
- `assets/js/` - Scripts JavaScript
- `assets/img/` - Imagens e ícones

### Configurações

- `.nojekyll` - Desativa o processamento Jekyll
- `robots.txt` - Instruções para robôs de busca
- `sitemap.xml` - Mapa do site para SEO
- `manifest.webmanifest` - Configuração do PWA

## 🔄 Processo de Deploy

O site é automaticamente implantado no GitHub Pages a cada push para o branch
`main`.

### Deploy Manual

1. Faça commit das alterações:

   ```bash
   git add .
   git commit -m "Atualizações no site"
   git push origin main
   ```

2. O GitHub Actions irá:
   - Construir o site
   - Executar testes
   - Fazer deploy para o GitHub Pages

## 🧪 Testes

### Testes Manuais

- [ ] Verificar responsividade
- [ ] Testar em diferentes navegadores
- [ ] Validar HTML/CSS
- [ ] Testar funcionalidades JavaScript

### Testes Automatizados

```bash
# Executar validação HTML
npm run test:html

# Validar CSS
npm run test:css

# Testes de acessibilidade
npm run test:a11y
```

## 🔍 SEO e Acessibilidade

### Meta Tags

- Título e descrição otimizados
- Open Graph para compartilhamento
- Twitter Cards

### Acessibilidade

- Navegação por teclado
- Contraste de cores adequado
- Textos alternativos em imagens
- ARIA labels onde necessário

## 🔒 Segurança

### Headers de Segurança

- CSP (Content Security Policy)
- HSTS
- XSS Protection
- Frame Options

### Boas Práticas

- Não armazenar dados sensíveis no código
- Usar HTTPS em todas as requisições
- Manter dependências atualizadas

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Envie um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo
[LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte, por favor abra uma
[issue](https://github.com/mozgbrasil/monorepo/issues) ou entre em contato via
[email](mailto:suporte@mozg.com.br).

---

📅 **Última Atualização**: Setembro de 2025\
🏷 **Versão**: 1.0.0
