import { MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";
import { api } from "~/trpc/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const copyPastas = await api.copyPasta.getAllApproved();

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
