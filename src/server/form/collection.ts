import { z } from "zod";

export const createCollectionForm = z.object({
  name: z
    .string()
    .min(10, {
      message: "Minimal 10 karakter",
    })
    .max(50, {
      message: "Max 59 karakter",
    }),
  description: z.string().min(10, {
    message: "Minimal 10 karakter",
  })
    .max(500, {
      message: "Max 500 karakter",
    }),
  copyPastaIds: z.array(z.string().uuid()).min(2, {
    message: "Minimal 2 copy pasta",
  }).max(3, {
    message: "Maximal 3 copy pasta"
  })
});