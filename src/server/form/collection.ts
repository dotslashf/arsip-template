import { z } from "zod";
import { FORM_COLLECTION_CONSTANT } from "~/lib/constant";

export const createCollectionForm = z.object({
  name: z
    .string()
    .min(FORM_COLLECTION_CONSTANT.name.min, {
      message: `Minimal ${FORM_COLLECTION_CONSTANT.name.min} karakter`,
    })
    .max(FORM_COLLECTION_CONSTANT.name.max, {
      message: `Max ${FORM_COLLECTION_CONSTANT.name.max} karakter`,
    }),
  description: z
    .string()
    .min(FORM_COLLECTION_CONSTANT.description.min, {
      message: `Minimal ${FORM_COLLECTION_CONSTANT.description.min} karakter`,
    })
    .max(FORM_COLLECTION_CONSTANT.description.max, {
      message: `Max ${FORM_COLLECTION_CONSTANT.description.max} karakter`,
    }),
  copyPastaIds: z
    .array(z.string().uuid())
    .min(FORM_COLLECTION_CONSTANT.copyPastaIds.min, {
      message: `Minimal ${FORM_COLLECTION_CONSTANT.copyPastaIds.min} template`,
    })
    .max(FORM_COLLECTION_CONSTANT.copyPastaIds.max, {
      message: `Maximal ${FORM_COLLECTION_CONSTANT.copyPastaIds.max} template`,
    }),
});

export const editCollectionForm = createCollectionForm.extend({
  id: z.string().uuid(),
});
