/**
 * CORES DO APLICATIVO
 *
 * Toda cor usada no app está definida aqui. As telas e componentes nunca escrevem
 * "#hex" direto no código: importam daqui. Assim, mudar uma cor é mudar uma linha.
 *
 * São duas paletas:
 *  - Trilha → tema TrilhaRun (creme + verde). Usado no login, cadastro, home,
 *             atividade em andamento e nos componentes de components/trilha.
 *  - Colors → tema claro (verde sobre cinza). Usado no resumo, histórico, detalhes,
 *             no site (about e WebNav), no mapa e nos alertas.
 */

export const Trilha = {
  bg: "#FFF8F5", // fundo das telas
  surface: "#F4ECE8", // cartões, campos de texto, chips
  surfaceStrong: "#EADFD9", // barras de força de senha apagadas
  text: "#1E1B19", // texto principal
  muted: "#6F6762", // texto secundário e ícones
  placeholder: "#A39A94", // texto de exemplo dentro dos campos
  primary: "#1B7F3B", // verde principal (botões, destaques)
  primarySoft: "#DCEFE0", // verde clarinho (fundos de ícones)
  danger: "#BA1A1A", // vermelho (finalizar atividade, sair)
  line: "#E4D8D2", // linhas da grade do mapa ao vivo
  white: "#FFFFFF", // texto/ícones sobre o verde
  transparent: "transparent", // borda "invisível" dos campos (vira verde no foco, na Web)

  // Fundos brancos translúcidos para etiquetas sobre ilustração e mapa.
  labelBg: "rgba(255,255,255,0.8)",
  badgeBg: "rgba(255,255,255,0.92)",

  // Ilustração de montanhas (components/trilha/HeroArt).
  art: {
    skyTop: "#CFE8D4",
    skyBottom: "#F4ECE8",
    mountainBack: "#6FA97E",
    mountainFront: "#2F8A4A",
    path: "#FFF8F5",
  },
};

export const Colors = {
  background: "#F4F6F1",
  surface: "#FFFFFF",
  text: "#16251C",
  muted: "#5F6F65",
  primary: "#1B7F4B",
  primarySoft: "#DCEFE4",
  danger: "#C0392B",
  border: "#DDE3DA",
  white: "#FFFFFF",

  // Fundo escurecido atrás do alerta e sombra do cartão (alerta da Web).
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "rgba(0, 0, 0, 0.2)",

  // Marcadores de início e fim do percurso no mapa (react-native-maps).
  mapStart: "green",
  mapEnd: "red",

  // Cores por tipo de alerta (components/alert).
  semantic: {
    error: { bg: "#FFEBEE", border: "#B71C1C", text: "#B71C1C" },
    success: { bg: "#E8F5E9", border: "#1B5E20", text: "#1B5E20" },
    warning: { bg: "#FFF8E1", border: "#FF8F00", text: "#FF8F00" },
    info: { bg: "#E3F2FD", border: "#2196F3", text: "#0D47A1" },
  },
};
