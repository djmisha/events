import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: Infinity, // Make toasts persistent
        className: "!bg-transparent !shadow-none !border-none !p-0",
      }}
    />
  );
};

export default ToastProvider;
