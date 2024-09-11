import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import { Suspense } from "react";
import SkeletonCopyPasta from "~/components/Skeleton/CopyPasta";
import ListCollectionPage from "../_components/ListCollectionPage";

export default function CollectionList() {
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
          <ListCollectionPage />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
