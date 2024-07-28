import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CopyPasta from "~/app/_components/CopyPastaByIdPage";
import Brand from "~/components/Brand";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/SkeletonCopyPasta";

export default function CopyPastaById({ params }: { params: { id: string } }) {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <Suspense
          fallback={
            <div className="flex w-full flex-col gap-4 lg:px-32">
              <SkeletonCopyPasta />
            </div>
          }
        >
          <CopyPasta id={params.id} />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
