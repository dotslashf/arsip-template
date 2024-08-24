import { z } from "zod";
import { OriginSource } from "@prisma/client";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const baseCopyPastaForm = z.object({
  content: z
    .string()
    .min(10, {
      message: "Minimal 10 karakter",
    })
    .max(2500, {
      message: "Max 500 karakter",
    }),
  postedAt: z
    .date()
    .default(new Date())
    .refine((date) => date <= new Date(), {
      message: "Tanggal tidak boleh dimasa depan",
    }),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  source: z.nativeEnum(OriginSource),
  tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        disable: z.boolean().optional(),
        fixed: z.boolean().optional(),
      }),
    )
    .max(3, {
      message: "Maximal 3 tag",
    })
    .refine((value) => value.some((item) => item), {
      message: "Pilih 1 tag",
    }),
});

export const createCopyPastaFormClient = baseCopyPastaForm.extend({
  imageUrl: z
    .any()
    .refine((file: File) => {
      if (!file) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only images are allowed")
    .refine((file: File) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, "Max file size is 2MB"),
});

export const createCopyPastaFormServer = baseCopyPastaForm.extend({
  imageUrl: z.string().url().nullish(),
});

export const editCopyPastaForm = createCopyPastaFormClient.extend({
  id: z.string().uuid(),
});
