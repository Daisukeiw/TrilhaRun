// Propriedades comuns aos alertas das três plataformas (Android, iOS e Web).
export interface AlertProps {
  title: string;
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: "success" | "error" | "warning" | "info";
}
