import { z } from "zod";
import { FORM_COLLECTION_CONSTANT } from "~/lib/constant";

export const createCollectionForm = z.object({
  name: z
    .string()
    .min(FORM_COLLECTION_CONSTANT.name.min, {
      message: "Minimal 10 karakter",
    })
    .max(FORM_COLLECTION_CONSTANT.name.max, {
      message: "Max 59 karakter",
    }),
  description: z
    .string()
    .min(FORM_COLLECTION_CONSTANT.description.min, {
      message: "Minimal 10 karakter",
    })
    .max(FORM_COLLECTION_CONSTANT.description.max, {
      message: "Max 500 karakter",
    }),
  copyPastaIds: z
    .array(z.string().uuid())
    .min(FORM_COLLECTION_CONSTANT.copyPastaIds.min, {
      message: "Minimal 2 copy pasta",
    })
    .max(FORM_COLLECTION_CONSTANT.copyPastaIds.max, {
      message: "Maximal 3 copy pasta",
    }),
});

export const editCollectionForm = createCollectionForm.extend({
  id: z.string().uuid(),
});
