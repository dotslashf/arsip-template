import { type MetadataRoute } from "next";
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

  const baseUrl = "https://arsiptemplate.app";

  const copyPastaEntries: MetadataRoute.Sitemap = copyPastas.map((pasta) => ({
    url: `${baseUrl}/copy-pasta/${pasta.id}`,
    lastModified: pasta.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: `${baseUrl}/copy-pasta`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...copyPastaEntries,
  ];
}
