import type { MetadataRoute } from "next";
import { baseUrl } from "~/lib/constant";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/trpc/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
