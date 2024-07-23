// import { getServerAuthSession } from "~/server/auth";
import CopyPastaCard, { CopyPastaCardWithTagsProps } from "~/components/CopyPastaCard";
import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "./_components/ListCopyPasta";
import SearchBar from "./_components/SearchBar";


export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <h1 className="text-2xl font-bold">ini<br />template<br />bukan</h1>
        <ListCopyPasta />
      </Layout>
    </HydrateClient>
  );
}
