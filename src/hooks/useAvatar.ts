import { useMemo } from "react";

import { createAvatar } from "@dicebear/core";
import { notionistsNeutral, notionists } from "@dicebear/collection";
import { avatarColorsThemeWithoutHash } from "~/lib/constant";

export default function useAvatar(seed: string, scale = 100) {
  const avatar = useMemo(() => {
    return createAvatar(notionists, {
      seed: seed,
      size: 256,
      radius: 50,
      scale,
      backgroundColor: avatarColorsThemeWithoutHash,
    }).toDataUri();
  }, [seed]);

  return avatar;
}
