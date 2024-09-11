import { Home, Library } from "lucide-react";
import { type ReactElement } from "react";

interface BreadCrumbWithIconProps {
  text: string;
}
export default function BreadCrumbWithIcon({ text }: BreadCrumbWithIconProps) {
  let parsedObject: {
    text: string;
    icon?: ReactElement;
  } = {
    text: "",
    icon: undefined,
  };

  switch (text) {
    case "collection":
      parsedObject = {
        text: "Koleksi",
        icon: <Library className="mr-2 w-4" />,
      };
      break;
    case "home":
      parsedObject = {
        text: "Beranda",
        icon: <Home className="mr-2 w-4" />,
      };
      break;
    default:
      parsedObject = {
        text,
      };
      break;
  }
  return (
    <span className="flex items-center">
      {parsedObject.icon} {parsedObject.text}
    </span>
  );
}
