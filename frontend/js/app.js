const responseOutput = document.getElementById("responseOutput");
const requestTitle = document.getElementById("requestTitle");
const responseBadge = document.getElementById("responseBadge");
const connectionLabel = document.getElementById("connectionLabel");
const connectionHint = document.getElementById("connectionHint");
const connectionDot = document.getElementById("connectionDot");
const cityInput = document.getElementById("cityInput");
const ufInput = document.getElementById("ufInput");
const limitInput = document.getElementById("limitInput");

function setStatus(state, label, hint) {
  connectionLabel.textContent = label;
  connectionHint.textContent = hint;
  connectionDot.style.background = state === "success" ? "var(--success)" : state === "error" ? "var(--danger)" : "var(--muted)";
}

function render(title, statusLabel, data, state = "success") {
  requestTitle.textContent = title;
  responseBadge.textContent = statusLabel;
  responseOutput.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  setStatus(state, statusLabel, `Base URL ativa: ${ApiClient.getBaseUrl()}`);
}

function renderError(title, error) {
  requestTitle.textContent = title;
  responseBadge.textContent = `HTTP ${error.status || "ERR"}`;
  responseOutput.textContent = JSON.stringify(error.data || { mensagem: "Erro inesperado" }, null, 2);
  setStatus("error", "Falha na requisição", error.data?.mensagem || "Verifique se a API está rodando em localhost:3000.");
}

async function runRequest(type) {
  try {
    if (type === "health") {
      const data = await ApiClient.request("/api/v1/health");
      render("GET /api/v1/health", "HTTP 200", data);
      return;
    }

    if (type === "clima") {
      const cidade = cityInput.value.trim();
      const path = `/api/v1/clima/${encodeURIComponent(cidade)}`;
      const data = await ApiClient.request(path);
      render(`GET ${path}`, "HTTP 200", data);
      return;
    }

    if (type === "cidades") {
      const uf = ufInput.value.trim().toUpperCase();
      const limite = limitInput.value ? `?limite=${encodeURIComponent(limitInput.value)}` : "";
      const path = `/api/v1/cidades/${encodeURIComponent(uf)}${limite}`;
      const data = await ApiClient.request(path);
      render(`GET ${path}`, "HTTP 200", data);
    }
  } catch (error) {
    renderError(`GET ${type}`, error);
  }
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => runRequest(button.dataset.action));
});

document.getElementById("quickCities").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-city]");
  if (!button) return;

  cityInput.value = button.dataset.city;
  ufInput.value = button.dataset.uf;
  runRequest("clima");
});

setStatus("neutral", "Pronto para testar", "Ajuste a URL e clique em uma rota.");