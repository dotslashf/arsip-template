import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import CopyPastaPage from "~/app/_components/CopyPastaByIdPage";
import Brand from "~/components/Brand";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/SkeletonCopyPasta";
import { type Metadata } from "next";
import { trimContent } from "~/lib/utils";
import { notFound } from "next/navigation";

export type PropsPage = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};
export async function generateMetadata({
  params,
}: PropsPage): Promise<Metadata> {
  const id = params.id;

  const copyPasta = await api.copyPasta.byId({ id });
  if (!copyPasta) {
    return notFound();
  }

  return {
    title: `${trimContent(copyPasta.content, 30)}`,
  };
}
export default function CopyPastaById({ params }: PropsPage) {
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
          <CopyPastaPage id={params.id} />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
