import { useMemo } from "react";

import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { avatarColorsTheme } from "~/lib/constant";

export default function useAvatar(seed: string, scale = 100) {
  const avatar = useMemo(() => {
    return createAvatar(notionists, {
      seed: seed,
      size: 256,
      radius: 50,
      scale,
      backgroundColor: avatarColorsTheme,
    }).toDataUri();
  }, [scale, seed]);

  return avatar;
}
