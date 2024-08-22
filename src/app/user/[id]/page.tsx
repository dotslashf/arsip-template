import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import Brand from "~/components/Brand";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/SkeletonCopyPasta";
import { type Metadata } from "next";
import { trimContent } from "~/lib/utils";
import { notFound } from "next/navigation";
import { baseUrl } from "~/lib/constant";
import UserCopyPastaPage from "~/app/_components/UserCopyPastaPage";

export type PropsPage = {
  params: { id: string };
};
export async function generateMetadata({
  params,
}: PropsPage): Promise<Metadata> {
  const id = params.id;

  const user = await api.user.byId({ id });
  if (!user) {
    return notFound();
  }

  const title = `${trimContent(user.name ?? "", 30)} | arsip-template`;
  const description = `Kumpulan arsip template dari: ${trimContent(user.name ?? "", 30)}`;
  const url = `${baseUrl}/api/og}`;

  return {
    title,
    alternates: {
      canonical: `/user/${user.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/user/${user.id}`,
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
export default function CopyPastaFromUserById({ params }: PropsPage) {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4">
              <SkeletonCopyPasta />
            </div>
          }
        >
          <UserCopyPastaPage id={params.id} />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
