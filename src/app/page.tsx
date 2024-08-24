// import { getServerAuthSession } from "~/server/auth";
import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "./_components/ListCopyPastaPage";
import Brand from "../components/Brand";
import { Suspense } from "react";
import SkeletonListCopyPasta from "~/components/SkeletonListCopyPasta";
import { type Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  let content = "";
  const search = searchParams.search as string;
  if (searchParams.search && searchParams.tag) {
    const tag = await api.tag.byId({ id: searchParams.tag as string });
    content = `${tag?.name} | ${search} `;
  } else if (searchParams.tag) {
    const tag = await api.tag.byId({ id: searchParams.tag as string });
    content = `${tag?.name} | `;
  } else if (searchParams.search) {
    content = `${search} | `;
  }
  const title = `${content}arsip-template`;
  return {
    title,
  };
}

export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <Suspense fallback={<SkeletonListCopyPasta />}>
          <ListCopyPasta />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
