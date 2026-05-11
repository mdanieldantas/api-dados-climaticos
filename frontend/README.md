# Front de teste das rotas

Interface simples em HTML, CSS e JavaScript puro para testar a API.

## Estrutura

- `index.html` - tela principal
- `css/styles.css` - estilos
- `js/api.js` - client de chamadas
- `js/app.js` - comportamento da tela

## Como usar

1. Suba a API com `npm start` ou `npm run dev`.
2. Abra `frontend/index.html` no navegador.
3. Se o navegador bloquear fetch ao abrir direto do arquivo, rode um servidor local simples, como `npx serve frontend` ou o Live Server do VS Code.

## Rotas testadas

- `/api/v1/health`
- `/api/v1/clima/:nome_cidade`
- `/api/v1/cidades/:sigla_uf?limite=10`