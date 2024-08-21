import { MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";
import { db } from "~/server/db";

export async function generateSitemaps() {
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
  return copyPastas;
}

export default async function sitemap({
  id,
  updatedAt,
}: {
  id: string;
  updatedAt: Date;
}): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${baseUrl}/copy-pasta/${id}`,
      lastModified: updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
