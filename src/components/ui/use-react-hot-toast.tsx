import { toast as rhToast } from "react-hot-toast";
import { type ToastType } from "~/lib/interface";

const useToast = () => {
  const toast = ({
    message,
    type,
    promiseFn,
    promiseMsg,
  }: ToastType): Promise<any> | void => {
    switch (type) {
      case "success":
        rhToast.success(message);
        return;
      case "danger":
        rhToast.error(message);
        return;
      case "info":
        rhToast(message, { icon: "ℹ️" });
        return;
      case "promise":
        if (promiseFn) {
          return rhToast.promise(
            promiseFn,
            promiseMsg ?? {
              error: "Error",
              loading: "Loading",
              success: "Success",
            },
          );
        }
        return;
      default:
        return;
    }
  };

  return toast;
};

export default useToast;
