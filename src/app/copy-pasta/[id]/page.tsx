import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import CopyPastaPage from "~/app/_components/CopyPastaByIdPage";
import Brand from "~/components/Brand";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/SkeletonCopyPasta";
import { type Metadata } from "next";
import { type CopyPasta } from "@prisma/client";
import { trimContent } from "~/lib/utils";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;

  const copyPasta = (await api.copyPasta.byId({ id })) as unknown as CopyPasta;

  return {
    title: `${trimContent(copyPasta.content, 30)}`,
  };
}
export default function CopyPastaById({ params }: Props) {
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
