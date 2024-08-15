import { CircleHelp } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { EmotionType } from "@prisma/client";
import {
  FluentEmojiFlatFaceWithSymbolsOnMouth,
  FluentEmojiFlatHundredPoints,
  FluentEmojiFlatRollingOnTheFloorLaughing,
  FluentEmojiFlatThinkingFace,
} from "~/components/Icons";

export interface DataInterface {
  copyPastas: string[];
  tags: string[];
  ranks: {
    title: string;
    minCount: number;
  }[];
}

export const avatarColorsTheme = [
  "#4D7CDB",
  "#D51010",
  "#FFFFFF",
  "#E6E8EA",
  "#A5C8E2",
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
      icon: <CircleHelp className="h-3 w-3" />,
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
