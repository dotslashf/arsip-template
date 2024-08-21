import { MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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

    const copyPastaEntries: MetadataRoute.Sitemap = copyPastas.map((pasta) => ({
      url: `${baseUrl}/copy-pasta/${pasta.id}`,
      lastModified: pasta.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url: `${baseUrl}/tos`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/ranking`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/changelog`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      },
      {
        url: `${baseUrl}/copy-pasta/create`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.8,
      },
    ];

    return [...staticRoutes, ...copyPastaEntries];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
