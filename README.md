# TrilhaRun (Meu Percurso)

Aplicativo para acompanhar corridas, caminhadas e pedaladas usando o **GPS do celular**, com um **site** de apresentação no mesmo projeto. Desenvolvido em React Native com Expo e TypeScript como atividade avaliativa da disciplina de Programação Mobile da Fatec.

O app registra o trajeto ponto a ponto, calcula distância, tempo e ritmo, salva as atividades no próprio aparelho e desenha o percurso em um mapa. O login e o cadastro usam o serviço de autenticação disponibilizado pelo professor, com sessão por cookie.

---

## Funcionalidades

### Aplicativo (Android)

- Login e cadastro integrados à API de autenticação.
- Escolha do tipo de atividade: corrida, caminhada ou ciclismo.
- Rastreamento por GPS em tempo real, com mapa ao vivo do trajeto.
- Cronômetro, distância percorrida e ritmo médio (min/km) ou velocidade média (km/h, no ciclismo).
- Resumo ao finalizar, com opção de salvar ou descartar.
- Histórico das atividades salvas no aparelho.
- Detalhes de cada atividade com o percurso desenhado em um mapa.

### Site (navegador)

- Login e cadastro com layout próprio para telas largas.
- Página "Sobre" explicando como o app funciona.
- Barra de navegação que mostra o perfil e o botão **Sair** quando o usuário está logado.

O rastreamento acontece só no aplicativo: o site é a porta de entrada e apresentação do projeto.

---

## Requisitos da atividade

| Requisito | Onde está |
|---|---|
| App Mobile (Android) e Web Site no mesmo projeto | `src/app/(mobile)` e `src/app/(web)`, com login/cadastro em `src/app/(auth)` |
| Criação de usuário | `POST /fatec/login/v1/create` → `integration/authIntegration.ts` |
| Login com cookie | `POST /fatec/login/v1/auth` → a sessão é o cookie devolvido pelo servidor |
| Recurso nativo do sistema operacional | **GPS** com `expo-location` → `services/locationService.ts` |

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native + Expo | Base do app e do site |
| TypeScript | Tipagem de todo o código |
| Expo Router | Rotas baseadas em arquivos |
| expo-location | GPS (permissão e acompanhamento da posição) |
| react-native-maps | Mapa com o percurso nos detalhes da atividade |
| react-native-svg | Mapa ao vivo e ilustrações |
| AsyncStorage | Atividades salvas e sessão local |
| Axios | Chamadas HTTP à API de autenticação |
| @expo/vector-icons | Ícones (Ionicons) |

---

## Como executar

**Pré-requisitos:** Node.js e o app **Expo Go** no celular (ou um emulador Android).

```bash
# instalar dependências
npm install

# iniciar o projeto (o -c limpa o cache)
npx expo start -c
```

No terminal do Expo:

- Leia o QR Code com o Expo Go para abrir no **celular**.
- Pressione `a` para abrir no **emulador Android**.
- Pressione `w` para abrir o **site** no navegador.

**GPS:** o app pede permissão de localização ao iniciar a primeira atividade. Para testar de verdade, ande com o celular; no emulador, use a simulação de localização. O app precisa ficar aberto durante a atividade (não há rastreamento em segundo plano).

**API:** o serviço de login fica hospedado no Render, no plano gratuito. A primeira requisição pode levar até um minuto enquanto o servidor "acorda".

---

## Estrutura de pastas

```
src/
├── app/                      Rotas (Expo Router): cada arquivo é uma tela
│   ├── _layout.tsx           Layout raiz: AuthProvider + ActivityProvider
│   ├── index.tsx             Rota "/": decide para onde mandar o usuário
│   ├── (auth)/               Login e cadastro
│   │   ├── login.tsx         Versão do celular
│   │   ├── login.web.tsx     Versão do navegador
│   │   ├── register.tsx
│   │   └── register.web.tsx
│   ├── (mobile)/             Telas do app (bloqueadas na Web)
│   │   ├── home.tsx          Escolher atividade e iniciar o GPS
│   │   ├── activity.tsx      Atividade em andamento
│   │   ├── summary.tsx       Resumo: salvar ou descartar
│   │   ├── history.tsx       Atividades salvas
│   │   └── activity-details.tsx  Detalhes + mapa do percurso
│   └── (web)/                Telas do site (bloqueadas no celular)
│       └── about.tsx         Página "Sobre"
├── components/               Componentes visuais reutilizáveis
│   ├── trilha/               Tema TrilhaRun (campos, botões, cabeçalho, mapa ao vivo...)
│   ├── alert/                Alerta com uma versão por plataforma
│   ├── RouteMap/             Mapa do percurso (versão web é só um aviso)
│   └── ...                   ActivityCard, StatCard, WebNav, button, header
├── constants/                Cores (colors.ts) e tipos de atividade
├── context/                  Estado compartilhado: sessão e atividade em andamento
├── hooks/                    Lógica dos formulários de login e cadastro
├── integration/              Comunicação com a API (axios)
├── services/                 Recursos nativos: GPS
├── storage/                  Persistência local (AsyncStorage)
├── types/                    Tipos TypeScript (Activity, LocationPoint)
└── utils/                    Funções puras: distância, tempo, ritmo, região do mapa
```

---

## Arquitetura

Cada camada tem uma responsabilidade, e as telas não falam diretamente com a API, o GPS ou o armazenamento:

```
Telas (app/)  ──►  Hooks / Context  ──►  integration/  ──►  API do professor
                                    ──►  services/     ──►  GPS (expo-location)
                                    ──►  storage/      ──►  AsyncStorage
```

- **Telas** só desenham a interface e chamam funções.
- **Hooks** (`useLoginForm`, `useRegisterForm`) guardam os valores e as validações dos formulários. Assim, a tela do celular e a do navegador compartilham a mesma lógica.
- **Context** guarda o estado que várias telas precisam ver: a sessão (`AuthContext`) e a atividade em andamento (`ActivityContext`).
- **integration / services / storage** isolam o que é externo. Trocar o armazenamento ou a API muda um arquivo só.
- **utils** são funções puras (entra valor, sai valor), fáceis de testar e de explicar.

### Rotas Web e Mobile no mesmo projeto

As pastas entre parênteses `(auth)`, `(mobile)` e `(web)` são **grupos de rotas**: organizam os arquivos mas não aparecem na URL (`(auth)/login.tsx` vira `/login`).

- O sufixo **`.web.tsx`** faz o Expo Router usar `login.web.tsx` no navegador e `login.tsx` no celular, na mesma URL.
- O `_layout.tsx` de `(mobile)` redireciona para o login se for aberto na Web, e o de `(web)` redireciona para o app se for aberto no celular.
- O mesmo mecanismo de sufixo é usado nos componentes: `RouteMap/index.web.tsx` existe porque o `react-native-maps` não funciona no navegador.

### Autenticação

1. A tela chama o hook, que valida os campos e chama `signIn` ou `signUp` do `AuthContext`.
2. O contexto chama `integration/authIntegration.ts`, que faz o `POST` na API.
3. No login, o servidor devolve um **cookie de sessão**. No celular, o sistema guarda o cookie automaticamente.
4. O nome do usuário é salvo no AsyncStorage (`@Auth:user`) para manter a sessão ao reabrir o app.
5. Em caso de erro, `getApiErrorInfo` extrai o status HTTP e a mensagem do servidor, e o usuário vê o motivo real (sem conexão, 403, usuário já existente...).

| Endpoint | Corpo |
|---|---|
| `POST https://login-p26w.onrender.com/fatec/login/v1/create` | `{ "username", "password", "email", "cep" }` |
| `POST https://login-p26w.onrender.com/fatec/login/v1/auth` | `{ "username", "password" }` |

### GPS e registro do percurso

1. Ao iniciar, `requestForegroundPermissionsAsync` pede permissão de localização.
2. `watchPositionAsync` passa a enviar a posição no máximo a cada **2 s** ou a cada **5 m** percorridos. Ele devolve uma **subscription**, guardada em um `useRef` e cancelada com `remove()` ao finalizar.
3. Leituras com precisão pior que **50 m** são ignoradas (GPS ainda calibrando).
4. Cada posição vira um `LocationPoint` (latitude, longitude, horário). Um ponto só entra na rota se estiver a pelo menos **3 m** do anterior, para a oscilação do GPS não inflar a distância.

### Distância (fórmula de Haversine)

Latitude e longitude são ângulos, não metros, e a Terra é curva. A fórmula de Haversine calcula a distância real entre dois pontos na superfície de uma esfera (raio de 6.371 km):

```
h = sin²(Δlat/2) + cos(lat1) · cos(lat2) · sin²(Δlon/2)
d = 2 · R · atan2(√h, √(1−h))
```

A distância total é a soma das distâncias entre cada par de pontos consecutivos (`utils/distance.ts`). Ela é recalculada a partir da rota (`useMemo`), então nunca fica fora de sincronia com os pontos.

O **tempo** é calculado como *agora − horário de início* a cada segundo, o que evita erros acumulados de cronômetro. **Ritmo** = minutos ÷ km; **velocidade** = km ÷ horas.

### Armazenamento local

O AsyncStorage guarda apenas texto. As atividades ficam em uma única chave (`@meu_percurso:activities`) como uma lista em JSON, com a mais recente primeiro. As telas usam só as funções de `storage/activityStorage.ts` (`saveActivity`, `getActivities`, `getActivityById`, `deleteActivity`).

### Mapas

- **Mapa ao vivo** (durante a atividade): desenhado com SVG, convertendo latitude/longitude em coordenadas x/y. Não precisa de chave de API de mapas.
- **Mapa nos detalhes**: `react-native-maps` com uma `Polyline` ligando os pontos em ordem e marcadores de início e fim. A região inicial é calculada para enquadrar todo o percurso (`utils/mapRegion.ts`).

### Cores

Todas as cores estão em `src/constants/colors.ts`, em duas paletas:

- `Trilha`: tema creme e verde (login, cadastro, home, atividade).
- `Colors`: tema claro (resumo, histórico, detalhes, site e alertas).

---

## Limitações conhecidas

- Não há rastreamento em segundo plano: o app precisa ficar aberto durante a atividade.
- As atividades ficam só no aparelho; não há sincronização com servidor.
- A sessão é restaurada a partir do nome salvo localmente, sem consultar o servidor novamente.
- No navegador, o cookie de sessão não é reenviado em outras requisições (o `apiClient` não usa `withCredentials`).
- "Esqueceu a senha?" ainda não está implementado.
