const ApiClient = (() => {
  function getBaseUrl() {
    const input = document.getElementById("baseUrl");
    return (input?.value || "http://localhost:3000").replace(/\/$/, "");
  }

  async function request(path) {
    const response = await fetch(`${getBaseUrl()}${path}`);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const error = new Error("Request failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  return {
    request,
    getBaseUrl,
  };
})();