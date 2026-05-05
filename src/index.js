const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares obrigatórios
app.use(cors());
app.use(express.json());

// Critério #1 — Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
