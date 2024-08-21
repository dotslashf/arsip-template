import { MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const copyPastas = await db.copyPasta.findMany({
    where: {
      approvedAt: {
        not: null,
      },
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const entries = copyPastas.map((copy) => {
    return {
      url: `${baseUrl}/copy-pasta/${copy.id}`,
      lastModified: copy.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  }) as MetadataRoute.Sitemap;

  return [...entries];
}
