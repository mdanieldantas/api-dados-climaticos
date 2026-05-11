const axios = require("axios");

async function buscarCidade(nomeCidade) {
  try {
    const url =
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=" +
      encodeURIComponent(nomeCidade);
    const response = await axios.get(url);
    const cidades = response.data;

    if (!cidades || cidades.length === 0) {
      return null;
    }

    // Exige correspondencia exata do nome
    const cidadeExata = cidades.find(
      (c) => c.nome.toLowerCase() === nomeCidade.toLowerCase()
    );

    if (!cidadeExata) {
      return null;
    }

    const cidade = cidadeExata;
    const uf = cidade.microrregiao.mesorregiao.UF;

    const coordenadasUF = {
      AC: { lat: -9.0238, lon: -70.812 },
      AL: { lat: -9.5713, lon: -36.782 },
      AM: { lat: -3.4168, lon: -65.856 },
      AP: { lat: -1.4102, lon: -51.77 },
      BA: { lat: -12.5797, lon: -41.7 },
      CE: { lat: -5.4984, lon: -39.32 },
      DF: { lat: -15.7998, lon: -47.864 },
      ES: { lat: -19.1834, lon: -40.308 },
      GO: { lat: -15.827, lon: -49.836 },
      MA: { lat: -5.422, lon: -45.44 },
      MG: { lat: -18.5122, lon: -44.555 },
      MS: { lat: -20.7722, lon: -54.785 },
      MT: { lat: -12.6819, lon: -56.921 },
      PA: { lat: -3.4168, lon: -52.29 },
      PB: { lat: -7.2399, lon: -36.782 },
      PE: { lat: -8.8137, lon: -36.954 },
      PI: { lat: -7.7183, lon: -42.729 },
      PR: { lat: -24.7822, lon: -51.989 },
      RJ: { lat: -22.9099, lon: -43.172 },
      RN: { lat: -5.8127, lon: -36.59 },
      RO: { lat: -10.9162, lon: -62.079 },
      RR: { lat: -1.99, lon: -61.33 },
      RS: { lat: -30.0346, lon: -51.217 },
      SC: { lat: -27.2423, lon: -50.218 },
      SE: { lat: -10.5741, lon: -37.385 },
      SP: { lat: -23.5505, lon: -46.633 },
      TO: { lat: -10.1753, lon: -48.298 },
    };

    const siglaUF = uf.sigla;
    const fallback = coordenadasUF[siglaUF] || { lat: -15.7998, lon: -47.864 };
    const lat = uf.regiao?.latitude ?? fallback.lat;
    const lon = uf.regiao?.longitude ?? fallback.lon;

    console.log("CIDADE:", cidade.nome, "| UF:", siglaUF, "| LAT:", lat, "| LON:", lon);

    return {
      nome: cidade.nome,
      estado: siglaUF,
      codigo_ibge: cidade.id,
      latitude: lat,
      longitude: lon,
    };

  } catch (error) {
    console.log("ERRO buscarCidade:", error.message);
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw { tipo: "SERVICO_EXTERNO", servico: "IBGE" };
  }
}

async function buscarCidadesPorUF(siglaUF) {
  try {
    const url =
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" +
      encodeURIComponent(siglaUF) +
      "/municipios";

    const response = await axios.get(url);
    const cidades = response.data;

    if (!Array.isArray(cidades) || cidades.length === 0) {
      return null;
    }

    return cidades.map((cidade) => ({ nome: cidade.nome }));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw { tipo: "SERVICO_EXTERNO", servico: "IBGE" };
  }
}

module.exports = { buscarCidade, buscarCidadesPorUF };