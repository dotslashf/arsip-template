import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
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

  const user = await api.user.byIdentifier({ identifier: id });
  if (!user) {
    return notFound();
  }

  const title = `${trimContent(user.name ?? "", 30)} `;
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
        <UserCopyPastaPage id={params.id} />
      </Layout>
    </HydrateClient>
  );
}
