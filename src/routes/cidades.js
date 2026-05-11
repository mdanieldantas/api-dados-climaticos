const express = require("express");
const router = express.Router();
const { buscarCidadesPorUF } = require("../services/ibge");

router.get("/:sigla_uf", async (req, res) => {
  const { sigla_uf } = req.params;
  const siglaNormalizada = (sigla_uf || "").trim().toUpperCase();

  if (!/^[a-zA-Z]{2}$/.test(sigla_uf || "")) {
    return res.status(400).json({
      erro: true,
      codigo: "SIGLA_UF_INVALIDA",
      mensagem: "A sigla do estado deve conter exatamente 2 letras",
      sigla_uf_informada: sigla_uf,
    });
  }

  const limiteRecebido = req.query.limite;
  const limite =
    limiteRecebido === undefined
      ? 10
      : Number.parseInt(String(limiteRecebido), 10);

  if (Number.isNaN(limite) || limite < 1 || limite > 100) {
    return res.status(400).json({
      erro: true,
      codigo: "LIMITE_INVALIDO",
      mensagem: "O limite deve ser um numero inteiro entre 1 e 100",
      limite_informado: limiteRecebido,
    });
  }

  try {
    const cidades = await buscarCidadesPorUF(siglaNormalizada);

    if (!cidades) {
      return res.status(404).json({
        erro: true,
        codigo: "UF_NAO_ENCONTRADA",
        mensagem: "Estado com a sigla informada nao foi encontrado",
        sigla_uf_informada: sigla_uf,
      });
    }

    const cidadesLimitadas = cidades.slice(0, limite);

    return res.status(200).json({
      uf: siglaNormalizada,
      quantidade_retornada: cidadesLimitadas.length,
      cidades: cidadesLimitadas,
      consultado_em: new Date().toISOString(),
    });
  } catch (error) {
    if (error.tipo === "SERVICO_EXTERNO") {
      return res.status(503).json({
        erro: true,
        codigo: "SERVICO_EXTERNO_INDISPONIVEL",
        mensagem:
          "Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes",
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