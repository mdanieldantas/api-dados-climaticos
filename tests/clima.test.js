const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../src/index");

describe("GET /api/v1/clima/:nome_cidade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna 200 para cidade valida", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 2304400,
            nome: "Fortaleza",
            microrregiao: {
              mesorregiao: {
                UF: {
                  sigla: "CE",
                  regiao: { latitude: -3.73, longitude: -38.52 },
                },
              },
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          daily: {
            weather_code: [53],
            temperature_2m_min: [23.2],
            temperature_2m_max: [31.1],
          },
        },
      });

    const response = await request(app).get("/api/v1/clima/Fortaleza");

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe("Fortaleza");
    expect(response.body.estado).toBe("CE");
    expect(response.body.clima).toHaveProperty("temperatura_min");
    expect(response.body.clima).toHaveProperty("temperatura_max");
    expect(response.body.clima).toHaveProperty("condicao");
    expect(response.body).toHaveProperty("consultado_em");
  });

  test("retorna 404 para cidade inexistente", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const response = await request(app).get(
      "/api/v1/clima/CidadeInexistente"
    );

    expect(response.status).toBe(404);
    expect(response.body.codigo).toBe("CIDADE_NAO_ENCONTRADA");
  });
});