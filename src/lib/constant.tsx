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

export const FORM_COLLECTION_CONSTANT = {
  name: {
    min: 10,
    max: 50,
  },
  description: {
    min: 10,
    max: 100,
  },
  copyPastaIds: {
    min: 3,
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

// User Interaction Events
export const USER_INTERACTION_EVENT = {
  BUTTON_CLICKED: "user_interaction.button_clicked",
  SEARCH: "user_interaction.search_performed",
  SHARE: "user_interaction.content_shared",
  REACTION: "user_interaction.reaction_given",
  BREADCRUMB_CLICKED: "user_interaction.breadcrumb_clicked",
};

// Content Engagement Events
const CONTENT_ENGAGEMENT_EVENT = {
  VIEW_ORIGINAL_DOCUMENT: "content_engagement.view_original_document",
  VIEW_FULL_COPY_PASTA: "content_engagement.view_full_copy_pasta",
};

// User Profile Events
const USER_PROFILE_EVENT = {
  PROFILE_UPDATED: "user_profile.profile_updated",
};

// System Events
const SYSTEM_EVENT = {
  SET_THEME: "system.theme_changed",
};

// Aggregate object for easy export
export const ANALYTICS_EVENT = {
  ...USER_INTERACTION_EVENT,
  ...CONTENT_ENGAGEMENT_EVENT,
  ...USER_PROFILE_EVENT,
  ...SYSTEM_EVENT,
};

export const CACHE_KEYS = {
  COUNT_CACHE_KEY: "COUNT_CACHE_KEY",
};
