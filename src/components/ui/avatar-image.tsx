import useAvatar from "~/hooks/useAvatar";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

interface AvatarProps {
  seed?: string;
  zoom?: number;
  size?: {
    width: number;
    height: number;
  };
}

export default function Avatar({ seed, zoom, size }: AvatarProps) {
  const avatarSeed = seed ?? uuidv4();
  const avatar = useAvatar(avatarSeed, zoom ?? 100);

  return (
    <Image
      src={avatar}
      width={size?.width ?? 50}
      height={size?.height ?? 50}
      alt="Avatar"
    />
  );
}
