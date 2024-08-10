import Brand from "~/components/Brand";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import RankingPage from "../_components/RankingPage";

export default async function Ranking() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <RankingPage />
      </Layout>
    </HydrateClient>
  );
}
