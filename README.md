# 🎓 Colégio Ilha Brasil - Website Institucional

Site institucional moderno e responsivo para o Colégio Ilha Brasil, desenvolvido com HTML5, CSS3 e JavaScript Vanilla, com integração Firebase e pronto para deploy na Vercel.

**Desenvolvido por:** Henrique Siqueira

---

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Configuração do Firebase](#-configuração-do-firebase)
- [Deploy na Vercel](#-deploy-na-vercel)
- [Personalização](#-personalização)
- [Funcionalidades](#-funcionalidades)
- [Suporte](#-suporte)

---

## ✨ Características

- ✅ **Design Moderno** com as cores da bandeira do Brasil
- ✅ **Totalmente Responsivo** (Mobile, Tablet e Desktop)
- ✅ **Slider Automático** com controles manuais
- ✅ **Navegação com Dropdown**
- ✅ **Sistema de Login** integrado com Firebase
- ✅ **Galeria de Fotos** com filtros
- ✅ **Seção de Notícias**
- ✅ **Animações Suaves** e efeitos modernos
- ✅ **SEO Otimizado**
- ✅ **Performance Otimizada**
- ✅ **Acessibilidade (WCAG)**

---

## 🚀 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização moderna com Grid e Flexbox
- **JavaScript ES6+** - Interatividade e funcionalidades
- **Firebase** - Backend e autenticação
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia

---

## 📁 Estrutura do Projeto

```
colegio-ilha-brasil/
│
├── index.html              # Página principal
├── login.html              # Página de login
├── README.md               # Documentação
│
├── css/
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Estilos responsivos
│
├── js/
│   ├── main.js            # JavaScript principal
│   ├── slider.js          # Controle do slider
│   ├── login.js           # Lógica de login
│   └── firebase-config.js # Configuração Firebase
│
└── assets/
    ├── images/
    │   ├── logo.png       # Logo do colégio
    │   ├── slides/        # Imagens do slider
    │   ├── galeria/       # Imagens da galeria
    │   └── noticias/      # Imagens de notícias
    └── icons/             # Ícones adicionais
```

---

## 🔧 Instalação

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Conta no Firebase
- Conta na Vercel (para deploy)

### Passo 1: Clone ou Baixe o Projeto

```bash
# Se você tiver Git instalado
git clone [URL_DO_REPOSITORIO]
cd colegio-ilha-brasil
```

Ou simplesmente extraia o arquivo ZIP.

### Passo 2: Adicione suas Imagens

1. Coloque o logo do colégio em: `assets/images/logo.png`
2. Adicione imagens do slider em: `assets/images/slides/`
   - Renomeie para: `slide1.jpg`, `slide2.jpg`, `slide3.jpg`
   - Tamanho recomendado: 1920x1080px
3. Adicione fotos da galeria em: `assets/images/galeria/`
   - Renomeie para: `img1.jpg`, `img2.jpg`, etc.
   - Tamanho recomendado: 800x600px
4. Adicione imagens de notícias em: `assets/images/noticias/`
   - Renomeie para: `noticia1.jpg`, `noticia2.jpg`, etc.
   - Tamanho recomendado: 800x500px

### Passo 3: Abra o Projeto

Você pode abrir o `index.html` diretamente no navegador ou usar uma extensão como **Live Server** no VS Code.

---

## 🔥 Configuração do Firebase

### 1. Criar Projeto no Firebase

1. Acesse: https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Dê um nome ao projeto (ex: "colegio-ilha-brasil")
4. Siga as instruções até criar o projeto

### 2. Adicionar App Web

1. No painel do projeto, clique no ícone Web `</>`
2. Registre o app com um nome
3. Copie as credenciais fornecidas

### 3. Configurar o Código

Abra o arquivo `js/firebase-config.js` e substitua:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};
```

### 4. Ativar Serviços do Firebase

#### Authentication:
1. No menu lateral, clique em "Authentication"
2. Clique em "Começar"
3. Ative os provedores:
   - **E-mail/senha**: Ative e salve
   - **Google**: Ative, configure o e-mail de suporte e salve

#### Firestore Database:
1. No menu lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Selecione "Modo de produção"
4. Escolha a localização (southamerica-east1 recomendado para Brasil)

#### Regras de Segurança do Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler e escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Todos podem ler notícias
    match /news/{newsId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage (Opcional):
1. No menu lateral, clique em "Storage"
2. Clique em "Começar"
3. Aceite as regras padrão

---

## 🌐 Deploy na Vercel

### Método 1: Via Interface Web (Recomendado)

1. Acesse: https://vercel.com/
2. Faça login ou crie uma conta
3. Clique em "Add New" → "Project"
4. Importe seu repositório ou faça upload dos arquivos
5. Configure o projeto:
   - **Framework Preset**: Other
   - **Build Command**: (deixe vazio)
   - **Output Directory**: ./
6. Clique em "Deploy"

### Método 2: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# No diretório do projeto
cd colegio-ilha-brasil

# Fazer deploy
vercel

# Para deploy em produção
vercel --prod
```

### Conectar Domínio Personalizado

1. No painel da Vercel, vá em "Settings" → "Domains"
2. Clique em "Add"
3. Digite seu domínio (ex: colegioilhabrasil.com.br)
4. Siga as instruções para configurar DNS:
   - **Tipo A**: Aponte para o IP da Vercel
   - **CNAME**: Aponte para o domínio da Vercel
5. Aguarde propagação DNS (até 48h)

### Configuração DNS Típica:
```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

---

## 🎨 Personalização

### Alterar Cores

Edite o arquivo `css/style.css`:

```css
:root {
    --verde-brasil: #009739;    /* Cor principal */
    --amarelo-brasil: #FEDD00;  /* Cor secundária */
    --azul-brasil: #002776;     /* Cor de destaque */
}
```

### Modificar Textos

Edite o arquivo `index.html` e altere os textos conforme necessário.

### Adicionar/Remover Seções

As seções estão claramente demarcadas no `index.html`. Você pode:
- Comentar seções que não quer usar
- Duplicar e modificar seções existentes
- Adicionar novas seções seguindo o padrão

### Alterar Informações de Contato

No `index.html`, procure pela seção `<footer>` e atualize:
- Telefone
- E-mail
- Endereço
- Redes sociais

---

## 📱 Funcionalidades

### Slider de Imagens
- Troca automática a cada 5 segundos
- Controles manuais (setas e indicadores)
- Suporte a toque (swipe) em dispositivos móveis
- Pausa ao passar o mouse
- Navegação por teclado (setas)

### Sistema de Login
- Login com e-mail e senha
- Login com Google
- Recuperação de senha
- Lembrar-me
- Validação em tempo real

### Galeria de Fotos
- Filtros por categoria
- Lightbox para visualização ampliada
- Animações suaves
- Layout responsivo

### Navegação
- Menu hambúrguer em mobile
- Dropdown menus
- Scroll suave para seções
- Link ativo baseado na rolagem
- Botão "Voltar ao topo"

---

## 🖼️ Como Trocar Imagens do Slider Manualmente

### Opção 1: Substituir Arquivos

1. Vá para `assets/images/slides/`
2. Substitua os arquivos:
   - `slide1.jpg`
   - `slide2.jpg`
   - `slide3.jpg`
3. Mantenha os mesmos nomes de arquivo

### Opção 2: Editar HTML

Abra `index.html` e encontre a seção do slider:

```html
<div class="slide active">
    <img src="assets/images/slides/slide1.jpg" alt="Slide 1">
    <div class="slide-content">
        <h1>Bem-vindo ao Colégio Ilha Brasil</h1>
        <p>Educação de qualidade que transforma vidas</p>
        <a href="#sobre" class="btn-primary">Conheça Mais</a>
    </div>
</div>
```

Altere:
- `src`: caminho da imagem
- `h1`: título do slide
- `p`: descrição do slide
- `href`: link do botão

---

## 🔒 Segurança

### Boas Práticas Implementadas

- ✅ Validação de formulários
- ✅ Sanitização de inputs
- ✅ HTTPS obrigatório (Vercel)
- ✅ Regras de segurança do Firebase
- ✅ Autenticação segura

### Recomendações Adicionais

1. **Nunca exponha sua API Key do Firebase** em repositórios públicos
2. Configure regras de segurança adequadas no Firestore
3. Use variáveis de ambiente para dados sensíveis
4. Ative 2FA na conta Firebase e Vercel
5. Monitore logs de acesso regularmente

---

## 📊 SEO e Performance

### Otimizações Implementadas

- ✅ Meta tags apropriadas
- ✅ Títulos e descrições únicos
- ✅ Alt text em todas as imagens
- ✅ Lazy loading de imagens
- ✅ Código minificado
- ✅ CSS e JS otimizados
- ✅ Sitemap.xml (adicionar manualmente)

### Melhorias Futuras Sugeridas

- Adicionar sitemap.xml
- Implementar robots.txt
- Adicionar Schema.org markup
- Implementar PWA (Progressive Web App)
- Adicionar Google Analytics
- Implementar cache service worker

---

## 🐛 Solução de Problemas

### Slider não funciona
- Verifique se as imagens existem nos caminhos corretos
- Abra o console do navegador (F12) e procure por erros
- Confirme que o arquivo `slider.js` está carregado

### Firebase não conecta
- Verifique se as credenciais estão corretas
- Confirme que os serviços estão ativados no console Firebase
- Verifique o console do navegador para erros específicos

### Site não funciona no celular
- Limpe o cache do navegador móvel
- Verifique se está acessando via HTTPS
- Teste em modo anônimo/privado

### Deploy na Vercel falha
- Verifique se todos os arquivos estão no diretório correto
- Confirme que não há erros no código
- Revise os logs de build na Vercel

---

## 📞 Suporte

### Contato do Desenvolvedor
**Henrique Siqueira**
- 💼 Desenvolvedor Full Stack
- 📧 [Seu e-mail aqui]
- 🌐 [Seu portfólio aqui]

### Recursos Úteis
- [Documentação Firebase](https://firebase.google.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3C Validator](https://validator.w3.org/)

---

## 📝 Licença

Este projeto foi desenvolvido especificamente para o Colégio Ilha Brasil.

© 2026 Colégio Ilha Brasil - Todos os direitos reservados.
**Desenvolvido com ❤️ por Henrique Siqueira**

---

## 🎯 Roadmap Futuro

### Fase 1 - Implementação Básica ✅
- [x] Design e layout
- [x] Páginas principais
- [x] Sistema de login
- [x] Responsividade

### Fase 2 - Funcionalidades Avançadas 🚧
- [ ] Dashboard do aluno
- [ ] Área administrativa
- [ ] Sistema de notas
- [ ] Calendário de eventos
- [ ] Chat com professores

### Fase 3 - Expansão 📋
- [ ] App mobile nativo
- [ ] Sistema de pagamento online
- [ ] Portal de pais
- [ ] Biblioteca virtual
- [ ] Gamificação

---

## 🙏 Agradecimentos

Obrigado por escolher este projeto para representar o Colégio Ilha Brasil online!

Para dúvidas, sugestões ou suporte, não hesite em entrar em contato.

**Bom trabalho! 🚀**
