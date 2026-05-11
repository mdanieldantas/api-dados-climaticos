const express = require('express');
const cors = require('cors');
const axios = require('axios');
const climaRoutes = require('./routes/clima');
const cidadesRoutes = require('./routes/cidades');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.get('/api/v1/health', async (req, res) => {
  try {
    await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/CE/municipios', {
      timeout: 3000
    });

    return res.status(200).json({
      status: 'healthy',
      versao: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(200).json({
      status: 'degraded',
      versao: '1.0.0',
      timestamp: new Date().toISOString(),
      motivo: 'Servico externo indisponivel'
    });
  }
});

app.use('/api/v1/clima', climaRoutes);
app.use('/api/v1/cidades', cidadesRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: true,
    codigo: 'ROTA_NAO_ENCONTRADA',
    mensagem: 'Rota nao encontrada',
    rota: req.originalUrl,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;