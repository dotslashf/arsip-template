import Layout from "~/components/Common/Layout";
import { api, HydrateClient } from "~/trpc/server";
import CopyPastaPage from "~/app/_components/CopyPastaByIdPage";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/Skeleton/CopyPasta";
import { type Metadata } from "next";
import {
  formatDateToHuman,
  generateSchemaById,
  trimContent,
} from "~/lib/utils";
import { notFound } from "next/navigation";
import { baseUrl } from "~/lib/constant";
import { type Article } from "schema-dts";

export type PropsPage = {
  params: { id: string };
};
export async function generateMetadata({
  params,
}: PropsPage): Promise<Metadata> {
  const id = params.id;

  const copyPasta = await api.copyPasta.byId({ id });
  if (!copyPasta) {
    return notFound();
  }

  const title = `${trimContent(copyPasta.content, 60)}`;
  const description = `${trimContent(copyPasta.content, 155)}`;
  const url = `${baseUrl}/api/og?copyPasta=${trimContent(copyPasta.content, 255)}`;

  return {
    title,
    alternates: {
      canonical: `${baseUrl}/copy-pasta/${copyPasta.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/copy-pasta/${copyPasta.id}`,
      images: [
        {
          url,
          width: 1200,
          height: 630,
          alt: "Cover",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@arsip-mim",
      images: [url],
    },
  };
}
export default async function CopyPastaById({ params }: PropsPage) {
  const copyPasta = await api.copyPasta.byId({ id: params.id });

  const defaultImage = `${baseUrl}/api/og?copyPasta=${trimContent(copyPasta.content, 255)}`;

  const richSearchAppearance = generateSchemaById<Article>({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: copyPasta.content,
    author: {
      "@type": "Person",
      url: `${baseUrl}/user/${copyPasta.createdBy.username ?? copyPasta.createdBy.id}`,
      name:
        copyPasta.createdBy.name ??
        copyPasta.createdBy.username ??
        copyPasta.createdBy.id,
    },
    datePublished: formatDateToHuman(
      copyPasta.approvedAt!,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    ),
    dateModified: formatDateToHuman(
      copyPasta.createdAt,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
    ),
    image: [copyPasta.imageUrl ?? defaultImage],
    description: copyPasta.content,
    thumbnailUrl: copyPasta.imageUrl ?? defaultImage,
  });

  return (
    <HydrateClient>
      <Layout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(richSearchAppearance),
          }}
        />
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <SkeletonCopyPasta />
            </div>
          }
        >
          <CopyPastaPage id={params.id} />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
