import axios from "axios";

// Endereço do serviço de login disponibilizado pelo professor.
const BASE_URL = "https://login-p26w.onrender.com";

// Cliente HTTP único do app: toda chamada à API passa por aqui.
// timeout de 30 s porque o servidor gratuito (Render) pode demorar para "acordar".
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});
