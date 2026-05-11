const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../src/index");

describe("GET /api/v1/clima/:nome_cidade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test.each([
    ["Fortaleza", "CE"],
    ["São Paulo", "SP"],
    ["Rio de Janeiro", "RJ"],
    ["Brasília", "DF"],
    ["Salvador", "BA"],
    ["Belo Horizonte", "MG"],
    ["Curitiba", "PR"],
    ["Manaus", "AM"],
  ])("retorna 200 para cidade valida: %s", async (nomeCidade, siglaUF) => {
    axios.get
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            nome: nomeCidade,
            microrregiao: {
              mesorregiao: {
                UF: {
                  sigla: siglaUF,
                  regiao: {},
                },
              },
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            {
              latitude: -10,
              longitude: -20,
            },
          ],
        },
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

    const response = await request(app).get(`/api/v1/clima/${encodeURIComponent(nomeCidade)}`);

    expect(response.status).toBe(200);
    expect(response.body.nome).toBe(nomeCidade);
    expect(response.body.estado).toBe(siglaUF);
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