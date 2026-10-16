// Configuração dinâmica da URL da API
// Permite que o front-end funcione tanto em desenvolvimento (localhost:8000) quanto na nuvem (Render)

export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    // 1. Prioriza a variável de ambiente pública se definida
    if (process.env.NEXT_PUBLIC_API_URL) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
    }

    // 2. Se estiver rodando na nuvem do Render (host onrender.com)
    if (window.location.hostname.includes("onrender.com")) {
      return "https://mantto-commerce-api.onrender.com";
    }
  }

  // 3. Fallback para ambiente local de desenvolvimento
  return "http://localhost:8000";
}
