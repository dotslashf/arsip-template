import { z } from "zod";
import { USER_PROFILE } from "~/lib/constant";

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export const editProfile = z.object({
  name: z
    .string()
    .min(USER_PROFILE.name.min, {
      message: `Minimal ${USER_PROFILE.name.min}`,
    })
    .max(USER_PROFILE.name.max, {
      message: `Maximal ${USER_PROFILE.name.max}`,
    }),
  avatarSeed: z.string(),
  username: z
    .string()
    .min(USER_PROFILE.username.min, {
      message: `Minimal ${USER_PROFILE.username.min}`,
    })
    .max(USER_PROFILE.username.max, {
      message: `Maximal ${USER_PROFILE.username.max}`,
    })
    .regex(alphanumericRegex, {
      message: "Hanya angka dan huruf ya",
    }),
});
