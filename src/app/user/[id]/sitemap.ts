import { type MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";
import { db } from "~/server/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await db.user.findMany({
    select: {
      id: true,
    },
  });

  const entries = users.map((copy) => {
    return {
      url: `${baseUrl}/user/${copy.id}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    };
  }) as MetadataRoute.Sitemap;

  return [...entries];
}
