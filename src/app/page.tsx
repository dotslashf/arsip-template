// import { getServerAuthSession } from "~/server/auth";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "./_components/ListCopyPasta";
import Brand from "./_components/Brand";

export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <ListCopyPasta />
      </Layout>
    </HydrateClient>
  );
}
