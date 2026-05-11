# API Dados Climaticos - N703

API REST em Node.js + Express para agregacao de dados geograficos (IBGE) e climaticos (Open-Meteo).

## Requisitos

- Node.js 18+
- npm 9+

## Como executar

```bash
npm install
npm run dev
```

Servidor em `http://localhost:3000`.

Para executar sem nodemon:

```bash
npm start
```

## Testes

```bash
npm test
```

## Endpoints

### Health

`GET /api/v1/health`

Resposta 200:

```json
{
  "status": "healthy",
  "versao": "1.0.0",
  "timestamp": "2026-05-05T19:36:11.491Z"
}
```

### Clima por cidade

`GET /api/v1/clima/:nome_cidade`

Exemplo:

`GET /api/v1/clima/Fortaleza`

As coordenadas da cidade sao obtidas dinamicamente via geocoding da Open-Meteo, a partir do nome validado no IBGE.

Erros tratados:
- 400 `NOME_INVALIDO`
- 404 `CIDADE_NAO_ENCONTRADA`
- 503 `SERVICO_EXTERNO_INDISPONIVEL`

### Cidades por UF

`GET /api/v1/cidades/:sigla_uf?limite=10`

Exemplo:

`GET /api/v1/cidades/CE?limite=5`

Regras:
- `sigla_uf` deve ter exatamente 2 letras
- `limite` e opcional, inteiro de 1 a 100, padrao 10

Erros tratados:
- 400 `SIGLA_UF_INVALIDA`
- 400 `LIMITE_INVALIDO`
- 404 `UF_NAO_ENCONTRADA`
- 503 `SERVICO_EXTERNO_INDISPONIVEL`

### Rota inexistente

Todas as rotas desconhecidas retornam JSON com `ROTA_NAO_ENCONTRADA`.

## APIs externas

- IBGE - Municipios por nome:
  `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome={nomeCidade}`
- IBGE - Municipios por estado:
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios`
- Open-Meteo:
  `https://api.open-meteo.com/v1/forecast`

## Estrutura principal

- `src/index.js`
- `src/routes/clima.js`
- `src/routes/cidades.js`
- `src/services/ibge.js`
- `src/services/weather.js`
- `tests/clima.test.js`
- `tests/cidades.test.js`
- `docs/postman_collection.json`
