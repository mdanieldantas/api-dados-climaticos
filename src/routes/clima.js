const express = require("express");
const router = express.Router();
const { buscarCidade, buscarCoordenadas } = require("../services/ibge");
const { buscarClima } = require("../services/weather");

// Critérios #2, #3, #4 — GET /api/v1/clima/:nome_cidade
router.get("/:nome_cidade", async (req, res) => {
  const { nome_cidade } = req.params;

  // Critério #4 — Erro 400: nome inválido
  if (!nome_cidade || nome_cidade.trim().length < 2) {
    return res.status(400).json({
      erro: true,
      codigo: "NOME_INVALIDO",
      mensagem: "O nome da cidade deve conter pelo menos 2 caracteres",
      nome_informado: nome_cidade,
    });
  }

  try {
    // Busca cidade no IBGE
    const cidade = await buscarCidade(nome_cidade);

    // Critério #3 — Erro 404: cidade não encontrada
    if (!cidade) {
      return res.status(404).json({
        erro: true,
        codigo: "CIDADE_NAO_ENCONTRADA",
        mensagem: "Nenhuma cidade encontrada com o nome informado",
        nome_informado: nome_cidade,
      });
    }

    // Busca coordenadas pelo código IBGE
    const coordenadas = await buscarCoordenadas(cidade.codigo_ibge);

    // Busca clima com as coordenadas dinâmicas
    const clima = await buscarClima(
      coordenadas.latitude,
      coordenadas.longitude,
    );

    // Critério #2 — Resposta de sucesso
    return res.status(200).json({
      nome: cidade.nome,
      estado: coordenadas.estado,
      clima: clima,
      consultado_em: new Date().toISOString(),
    });
  } catch (error) {
    // Critério — Erro 503: serviço externo indisponível
    if (error.tipo === "SERVICO_EXTERNO") {
      return res.status(503).json({
        erro: true,
        codigo: "SERVICO_EXTERNO_INDISPONIVEL",
        mensagem:
          "Não foi possível obter dados do serviço externo. Tente novamente em alguns instantes",
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
