import axios from "axios";

// Endereço do serviço de login disponibilizado pelo professor.
const BASE_URL = "https://login-p26w.onrender.com";

// Cliente HTTP único do app: toda chamada à API passa por aqui.
// timeout de 30 s porque o servidor gratuito (Render) pode demorar para "acordar".
//
// withCredentials: true → no NAVEGADOR, permite guardar o cookie de sessão que a API
// devolve no login (Set-Cookie) e reenviá-lo nas próximas requisições. Sem isso, o
// navegador descarta o cookie porque a API está em outro domínio. No celular não muda
// nada: lá a camada de rede do sistema já guarda e reenvia os cookies sozinha.
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
