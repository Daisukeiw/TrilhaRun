import { useCallback, useState } from "react";
import type { AlertProps } from "@/components/alert";

type AlertType = NonNullable<AlertProps["type"]>;

// Controla o alerta reutilizável (components/alert) das telas de login e cadastro.
// Uso: const { alertProps, showAlert } = useAlertState();  ...  <Alert {...alertProps} />
export function useAlertState() {
  const [state, setState] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" as AlertType,
  });

  const showAlert = useCallback((title: string, message: string, type: AlertType = "info") => {
    setState({ visible: true, title, message, type });
  }, []);

  // useCallback mantém a mesma função entre renders (o Alert web usa isso em um useEffect).
  const closeAlert = useCallback(() => {
    setState((previous) => ({ ...previous, visible: false }));
  }, []);

  return { alertProps: { ...state, onClose: closeAlert }, showAlert };
}
