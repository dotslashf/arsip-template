import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faFacebook,
  faDiaspora,
} from "@fortawesome/free-brands-svg-icons";
import { EmotionType } from "@prisma/client";
import {
  FluentEmojiFlatFaceWithSymbolsOnMouth,
  FluentEmojiFlatHundredPoints,
  FluentEmojiFlatRollingOnTheFloorLaughing,
  FluentEmojiFlatThinkingFace,
} from "~/components/Icons";
import { Roboto_Slab } from "next/font/google";

export const avatarColorsTheme = [
  "#4D7CDB",
  "#D51010",
  "#FFFFFF",
  "#E6E8EA",
  "#A5C8E2",
];

export const avatarColorsThemeWithoutHash = avatarColorsTheme.map((color) =>
  color.slice(1, color.length),
);

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

export const reactionsMap = (emotion: string, className: string) => {
  const map: Record<
    string,
    {
      name: EmotionType;
      child: JSX.Element;
    }
  > = {
    Kocak: {
      name: EmotionType.Kocak,
      child: <FluentEmojiFlatRollingOnTheFloorLaughing className={className} />,
    },
    Hah: {
      name: EmotionType.Hah,
      child: <FluentEmojiFlatThinkingFace className={className} />,
    },
    Marah: {
      name: EmotionType.Marah,
      child: <FluentEmojiFlatFaceWithSymbolsOnMouth className={className} />,
    },
    Setuju: {
      name: EmotionType.Setuju,
      child: <FluentEmojiFlatHundredPoints className={className} />,
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
  if (message.toLowerCase().includes("unique")) {
    return "Data sudah ada!";
  } else {
    return "Duh, gagal nih! 🤯";
  }
};
