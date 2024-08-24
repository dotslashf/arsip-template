import { z } from "zod";
import { createTRPCRouter, protectedProcedureLimited } from "~/server/api/trpc";
import { generateV4WriteSignedUrl } from "~/server/util/storage";
import { v4 as uuid } from "uuid";

export const uploadRouter = createTRPCRouter({
  getUploadSignedUrl: protectedProcedureLimited
    .input(
      z.object({
        fileName: z.string(),
        contentType: z.string().refine((type) => type.startsWith("image/"), {
          message: "Only image files are allowed",
        }),
      }),
    )
    .mutation(async ({ input }) => {
      const fileName = uuid();

      const url = await generateV4WriteSignedUrl(fileName, input.contentType);
      return url;
    }),
});
