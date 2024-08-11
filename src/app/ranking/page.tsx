import Brand from "~/components/Brand";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import RankingPage from "../_components/RankingPage";
import RankSkeleton from "~/components/RankSkeleton";
import { Suspense } from "react";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking Tukang Arsip",
  description: "Disini kamu dapat melihat ranking tukang arsip",
};
export default async function Ranking() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <Suspense fallback={<RankSkeleton />}>
          <RankingPage />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
