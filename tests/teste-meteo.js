const axios = require("axios");

async function testar() {
  try {
    const response = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: -3.7,
        longitude: -38.5,
        daily: "temperature_2m_max,temperature_2m_min,weather_code",
        timezone: "America/Sao_Paulo",
        forecast_days: 1,
      },
    });

    console.log("STATUS:", response.status);
    console.log("DADOS:", JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log("ERRO:", error.message);
    console.log("RESPOSTA:", error.response?.data);
  }
}

testar();