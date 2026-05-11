const express = require('express');
const router = express.Router();
const { buscarCidade } = require('../services/ibge');
const { buscarClima } = require('../services/weather');

router.get('/:nome_cidade', async (req, res) => {
  const { nome_cidade } = req.params;

  if (!nome_cidade || nome_cidade.trim().length < 2) {
    return res.status(400).json({
      erro: true,
      codigo: 'NOME_INVALIDO',
      mensagem: 'O nome da cidade deve conter pelo menos 2 caracteres',
      nome_informado: nome_cidade
    });
  }

  try {
    const cidade = await buscarCidade(nome_cidade);

    if (!cidade) {
      return res.status(404).json({
        erro: true,
        codigo: 'CIDADE_NAO_ENCONTRADA',
        mensagem: 'Nenhuma cidade encontrada com o nome informado',
        nome_informado: nome_cidade
      });
    }

    const clima = await buscarClima(cidade.latitude, cidade.longitude);

    return res.status(200).json({
      nome: cidade.nome,
      estado: cidade.estado,
      clima: clima,
      consultado_em: new Date().toISOString()
    });

   } catch (error) {
    console.log("ERRO ROTA CLIMA:", error);

    if (error.tipo === "SERVICO_EXTERNO") {
      return res.status(503).json({
        erro: true,
        codigo: "SERVICO_EXTERNO_INDISPONIVEL",
        mensagem: "Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes",
        servico: error.servico,
      });
    }

    return res.status(500).json({
      erro: true,
      codigo: "ERRO_INTERNO",
      mensagem: "Erro interno do servidor",
    });
  }
});

module.exports = router;