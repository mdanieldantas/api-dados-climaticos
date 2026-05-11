const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../src/index");

describe("GET /api/v1/cidades/:sigla_uf", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna 200 com lista de cidades", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { nome: "Abaiara" },
        { nome: "Acarape" },
        { nome: "Acarau" },
      ],
    });

    const response = await request(app).get("/api/v1/cidades/CE?limite=2");

    expect(response.status).toBe(200);
    expect(response.body.uf).toBe("CE");
    expect(response.body.quantidade_retornada).toBe(2);
    expect(response.body.cidades).toEqual([
      { nome: "Abaiara" },
      { nome: "Acarape" },
    ]);
    expect(response.body).toHaveProperty("consultado_em");
  });

  test("retorna 404 para UF inexistente", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    const response = await request(app).get("/api/v1/cidades/XX");

    expect(response.status).toBe(404);
    expect(response.body.codigo).toBe("UF_NAO_ENCONTRADA");
  });

  test("retorna 400 para sigla invalida", async () => {
    const response = await request(app).get("/api/v1/cidades/ceara");

    expect(response.status).toBe(400);
    expect(response.body.codigo).toBe("SIGLA_UF_INVALIDA");
  });
});