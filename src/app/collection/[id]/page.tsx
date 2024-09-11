import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/Skeleton/CopyPasta";
import { type Metadata } from "next";
import { trimContent } from "~/lib/utils";
import { notFound } from "next/navigation";
import { baseUrl } from "~/lib/constant";
import CollectionByIdPage from "~/app/_components/CollectionByIdPage";

export type PropsPage = {
  params: { id: string };
};
export async function generateMetadata({
  params,
}: PropsPage): Promise<Metadata> {
  const id = params.id;

  const collection = await api.collection.byId({ id });
  if (!collection) {
    return notFound();
  }

  const title = `${trimContent(collection.name, 60)}`;
  const description = `${trimContent(collection.description ?? "", 155)}`;
  const url = `${baseUrl}/api/og?copyPasta=${trimContent(collection.name, 255)}`;

  return {
    title,
    alternates: {
      canonical: `${baseUrl}/collection/${collection.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/collection/${collection.id}`,
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
export default function CollectionById({ params }: PropsPage) {
  return (
    <HydrateClient>
      <Layout>
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <SkeletonCopyPasta />
            </div>
          }
        >
          <CollectionByIdPage id={params.id} />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
