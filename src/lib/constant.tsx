import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faDiaspora,
} from "@fortawesome/free-brands-svg-icons";
import { EmotionType } from "@prisma/client";
import { Roboto_Slab } from "next/font/google";

export const avatarColorsTheme = [
  "4D7CDB",
  "D51010",
  "FFFFFF",
  "E6E8EA",
  "A5C8E2",
];

export const sourceEnumHash = new Map([
  [
    "Twitter",
    {
      label: "Twitter (X)",
      value: "Twitter",
      icon: <FontAwesomeIcon icon={faTwitter} className="h-3 w-3" />,
    },
  ],
  [
    "Facebook",
    {
      label: "Facebook",
      value: "Facebook",
      icon: <FontAwesomeIcon icon={faFacebook} className="h-3 w-3" />,
    },
  ],
  [
    "Other",
    {
      label: "Lainnya",
      value: "Other",
      icon: <FontAwesomeIcon icon={faDiaspora} className="h-3 w-3" />,
    },
  ],
]);

export const reactionsMap = (emotion: string) => {
  const map: Record<
    string,
    {
      name: EmotionType;
    }
  > = {
    Kocak: {
      name: EmotionType.Kocak,
    },
    Hah: {
      name: EmotionType.Hah,
    },
    Marah: {
      name: EmotionType.Marah,
    },
    Setuju: {
      name: EmotionType.Setuju,
    },
  };

  return map[emotion];
};

export const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://arsiptemplate.app"
    : "http://localhost:3000";

export const robotoSlab = Roboto_Slab({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin"],
});

export const DAYS = 24 * 60 * 60 * 1000;

export const USER_PROFILE = {
  name: {
    min: 5,
    max: 30,
  },
  username: {
    min: 6,
    max: 15,
  },
};

export const parseErrorMessages = (error: Record<string, any>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const message = error.shape.message as string;
  if (message.toLowerCase().includes("unique") || message === "BAD_REQUEST") {
    return "Data sudah ada!";
  } else {
    return "Duh, gagal nih! 🤯";
  }
};

export const ANALYTICS_EVENT = {
  BUTTON_CLICKED: "button_clicked",
  DOKSLI: "dokumen_asli",
  SEARCH: "search",
  SET_THEME: "set_theme",
  SHARE: "share",
  REACTION: "reaction",
  SUMMARY_REACTION: "summary_reaction",
};
