import { Toaster } from "react-hot-toast";
import styles from "./ToastProvider.module.scss";

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: Infinity, // Make toasts persistent
        className: styles.toast,
      }}
    />
  );
};

export default ToastProvider;
