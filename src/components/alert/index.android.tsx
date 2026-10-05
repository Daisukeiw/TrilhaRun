import React, { useEffect } from "react";
import { Alert as RNAlert } from "react-native";
import { AlertProps } from "./types";

// Alerta do ANDROID: abre o diálogo nativo quando `visible` vira true.
// Não desenha nada na tela (return null); o sistema operacional cuida da caixa.
const AlertAndroid: React.FC<AlertProps> = ({ title, message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      RNAlert.alert(title, message, [{ text: "OK", onPress: onClose }]);
    }
  }, [visible]);

  return null;
};

export default AlertAndroid;
