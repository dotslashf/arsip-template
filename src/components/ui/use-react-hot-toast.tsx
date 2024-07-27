import { toast as rhToast } from "react-hot-toast";
interface toastType {
  message: string;
  type: "info" | "success" | "danger" | "promise";
  promiseFn?: Promise<unknown>;
  promiseMsg?: {
    success: string;
    error: string;
    loading: string;
  };
}

const useToast = () => {
  const toast = ({ message, type, promiseFn, promiseMsg }: toastType): void => {
    switch (type) {
      case "success":
        rhToast.success(message);
        break;
      case "danger":
        rhToast.error(message);
        break;
      case "info":
        rhToast(message, {
          icon: "ℹ️",
        });
        break;
      case "promise":
        void rhToast.promise(
          promiseFn!,
          promiseMsg ?? {
            error: "Error",
            loading: "Loading",
            success: "Success",
          },
        );
        break;
    }
  };

  return toast;
};

export default useToast;
