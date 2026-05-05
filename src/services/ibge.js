const axios = require('axios');

async function buscarCidade(nomeCidade) {
  try {
    const response = await axios.get(
      https://brasilapi.com.br/api/ibge/municipios/v1/${encodeURIComponent(nomeCidade)}?providers=dados-abertos-br,gov,wikipedia
    );

    const cidades = response.data;

    if (!cidades || cidades.length === 0) {
      return null;
    }

    // Pega a primeira cidade encontrada
    const cidade = cidades[0];

    return {
      nome: cidade.nome,
      estado: cidade.codigo_ibge.toString().substring(0, 2),
      codigo_ibge: cidade.codigo_ibge
    };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw { tipo: 'SERVICO_EXTERNO', servico: 'IBGE' };
  }
}

async function buscarCoordenadas(codigoIbge) {
  try {
    const response = await axios.get(
      https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${codigoIbge}
    );

    const data = response.data;

    return {
      latitude: data.microrregiao.mesorregiao.UF.regiao.latitude ?? -15.77972,
      longitude: data.microrregiao.mesorregiao.UF.regiao.longitude ?? -47.92972,
      estado: data.microrregiao.mesorregiao.UF.sigla
    };

  } catch (error) {
    throw { tipo: 'SERVICO_EXTERNO', servico: 'IBGE' };
  }
}

module.exports = { buscarCidade, buscarCoordenadas };