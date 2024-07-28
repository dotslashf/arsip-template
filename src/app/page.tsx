// import { getServerAuthSession } from "~/server/auth";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "./_components/ListCopyPastaPage";
import Brand from "../components/Brand";
import { Suspense } from "react";
import SkeletonListCopyPasta from "~/components/SkeletonListCopyPasta";

export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <Suspense fallback={<SkeletonListCopyPasta />}>
          <ListCopyPasta />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
