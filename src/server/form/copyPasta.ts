import { z } from "zod";
import { OriginSource } from "@prisma/client";

export const createCopyPastaForm = z.object({
  content: z
    .string()
    .min(10, {
      message: "Minimal 10 karakter",
    })
    .max(2500, {
      message: "Max 500 karakter",
    }),
  postedAt: z.date(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  source: z.nativeEnum(OriginSource),
  tags: z
    .array(z.string())
    .max(3, {
      message: "Maximal 3 tag",
    })
    .refine((value) => value.some((item) => item), {
      message: "Pilih 1 tag",
    }),
});
