const axios = require("axios");

async function buscarClima(latitude, longitude) {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: latitude,
        longitude: longitude,
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        timezone: "America/Sao_Paulo",
        forecast_days: 1,
      },
    });

    const data = response.data.daily;
    const condicao = traduzirCondicao(data.weather_code[0]);

    return {
      temperatura_min: Math.round(data.temperature_2m_min[0]),
      temperatura_max: Math.round(data.temperature_2m_max[0]),
      condicao: condicao,
      unidades: {
        temperatura: "°C",
      },
    };

  } catch (error) {
    console.log("ERRO WEATHER:", error.message, error.response?.data);
    throw { tipo: "SERVICO_EXTERNO", servico: "OPEN_METEO" };
  }
}

function traduzirCondicao(codigo) {
  const condicoes = {
    0: "Ceu Limpo",
    1: "Predominantemente Limpo",
    2: "Parcialmente Nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina com Geada",
    51: "Garoa Leve",
    53: "Garoa Moderada",
    55: "Garoa Intensa",
    61: "Chuva Leve",
    63: "Chuva Moderada",
    65: "Chuva Forte",
    80: "Pancadas de Chuva Leve",
    81: "Pancadas de Chuva Moderada",
    82: "Pancadas de Chuva Forte",
    95: "Tempestade",
    96: "Tempestade com Granizo",
    99: "Tempestade com Granizo Forte",
  };

  return condicoes[codigo] || "Condicao Desconhecida";
}

module.exports = { buscarClima };