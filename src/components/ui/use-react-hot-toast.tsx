import { toast as rhToast } from "react-hot-toast";
import { type ToastType } from "~/lib/interface";

const useToast = () => {
  const toast = ({ message, type, promiseFn, promiseMsg }: ToastType): void => {
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
