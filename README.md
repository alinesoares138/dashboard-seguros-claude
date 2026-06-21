# Análise Econométrica de Seguros Automotivos

Dashboard interativo de análise de dados aplicada ao mercado de seguros automotivos, com 7 testes econométricos (Regressão Logística, Poisson, MQO, Tobit, Teste t/ANOVA e Série Temporal) traduzidos em linguagem de negócio.

🧪 **Dados fictícios**, gerados para fins de portfólio.

Autoria: Aline Soares

---

## Como publicar no GitHub Pages

### 1. Crie um repositório no GitHub
Crie um repositório novo (público) — por exemplo `dashboard-seguros`.

### 2. Ajuste o `vite.config.js`
Abra o arquivo `vite.config.js` e troque `NOME_DO_REPOSITORIO` pelo nome exato do repositório que você criou:

```js
export default defineConfig({
  plugins: [react()],
  base: '/dashboard-seguros/', // <- nome do seu repositório aqui
})
```

⚠️ Se o nome do repositório for diferente disso, o site vai carregar em branco (problema clássico do GitHub Pages com Vite). Esse passo é obrigatório.

### 3. Suba o código para o GitHub
No terminal, dentro desta pasta:

```bash
git init
git add .
git commit -m "Dashboard inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/dashboard-seguros.git
git push -u origin main
```

### 4. Instale as dependências e gere o build de produção
```bash
npm install
npm run build
```

### 5. Publique no GitHub Pages
Este projeto já vem com o pacote `gh-pages` configurado. Basta rodar:

```bash
npm run deploy
```

Isso vai criar/atualizar automaticamente a branch `gh-pages` com o conteúdo da pasta `dist`.

### 6. Ative o GitHub Pages no repositório
No GitHub, vá em **Settings → Pages**, e em "Source" selecione a branch `gh-pages` (pasta `/ (root)`). Salve.

Em alguns minutos, seu dashboard estará disponível em:

```
https://SEU_USUARIO.github.io/dashboard-seguros/
```

---

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`

## Atualizando o dashboard depois de publicado

Sempre que editar `src/App.jsx`, repita os passos 4 e 5 (`npm run build` e `npm run deploy`) para atualizar o link público.
