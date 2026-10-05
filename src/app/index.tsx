import { Platform } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

// Rota "/": não tem tela própria, só decide para onde mandar o usuário.
// Navegador → página "Sobre" do site.
// Celular → home se já estiver logado; senão, login.
// (Telas como o resumo voltam para "/" ao descartar; sem olhar a sessão, iam parar no login.)
export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (Platform.OS === "web") return <Redirect href="/about" />;
  if (isLoading) return null; // espera ler a sessão salva no aparelho

  return <Redirect href={isAuthenticated ? "/home" : "/login"} />;
}
