// import { getServerAuthSession } from "~/server/auth";
import CopyPastaCard, { CopyPastaCardWithTagsProps } from "~/components/CopyPastaCard";
import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "./_components/ListCopyPasta";
import SearchBar from "./_components/SearchBar";
import Link from "next/link";


export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <Link href={'/'}><h1 className="text-2xl font-bold">ini<br />template<br />bukan</h1></Link>
        <ListCopyPasta />
      </Layout>
    </HydrateClient>
  );
}
