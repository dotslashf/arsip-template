import { type MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
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

    return [...staticRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
