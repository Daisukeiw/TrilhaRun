import { Platform } from "react-native";
import { AlertProps } from "./types";

import AlertIOS from "./index.ios";
import AlertAndroid from "./index.android";
import AlertWeb from "./index.web";

export { AlertImplementation as Alert };
export * from "./types";

// Escolhe o alerta pela plataforma: Android e iOS usam o Alert nativo do sistema;
// a Web usa um cartão próprio (index.web.tsx). As telas só importam { Alert } daqui.
const AlertImplementation = Platform.select({
  ios: AlertIOS,
  android: AlertAndroid,
  web: AlertWeb,
  default: AlertWeb,
}) as React.FC<AlertProps>;
