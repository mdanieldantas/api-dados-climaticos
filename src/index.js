const express = require('express');
const cors = require('cors');
const climaRoutes = require('./routes/clima');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1/clima', climaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});