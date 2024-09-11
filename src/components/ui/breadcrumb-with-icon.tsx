import {
  ChartNoAxesColumn,
  HandCoins,
  Home,
  Library,
  Medal,
  MonitorDot,
  NotebookPen,
  Pencil,
  Plus,
  User,
} from "lucide-react";
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
    case "dashboard":
      parsedObject = {
        text: "Dashboard",
        icon: <MonitorDot className="mr-2 w-4" />,
      };
      break;
    case "edit":
      parsedObject = {
        text: "Edit",
        icon: <Pencil className="mr-2 w-4" />,
      };
      break;
    case "profile":
      parsedObject = {
        text: "Profile",
        icon: <User className="mr-2 w-4" />,
      };
      break;
    case "home":
      parsedObject = {
        text: "Beranda",
        icon: <Home className="mr-2 w-4" />,
      };
      break;
    case "ranking":
      parsedObject = {
        text: "Peringkat",
        icon: <Medal className="mr-2 w-4" />,
      };
      break;
    case "statistics":
      parsedObject = {
        text: "Statistik",
        icon: <ChartNoAxesColumn className="mr-2 w-4" />,
      };
      break;
    case "support":
      parsedObject = {
        text: "Beri Dukungan",
        icon: <HandCoins className="mr-2 w-4" />,
      };
      break;
    case "copy-pasta":
      parsedObject = {
        text: "Template",
        icon: <NotebookPen className="mr-2 w-4" />,
      };
      break;
    case "create":
      parsedObject = {
        text: "Tambah",
        icon: <Plus className="mr-2 w-4" />,
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
