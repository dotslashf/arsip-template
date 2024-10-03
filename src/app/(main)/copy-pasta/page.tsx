import Layout from "~/components/Common/Layout";
import { api, HydrateClient } from "~/trpc/server";
import { ListCopyPasta } from "~/app/_components/ListCopyPastaPage";
import { type Metadata } from "next";
import { baseUrl } from "~/lib/constant";

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  let content = "";
  const search = searchParams.search as string;

  let tag = null;
  if (searchParams.tag) {
    tag = await api.tag.byId({ id: searchParams.tag as string });
  }

  if (searchParams.search && searchParams.tag) {
    content = `${tag?.name} | ${search} `;
  } else if (searchParams.tag) {
    content = `${tag?.name} | `;
  } else if (searchParams.search) {
    content = `${search} | `;
  }
  const title = `${content}arsip template`;
  return {
    title,
    alternates: searchParams.tag
      ? {
          canonical: `${baseUrl}/?tag=${tag?.id}`,
        }
      : {},
    description: searchParams.tag
      ? `Arsip template dengan tag: ${tag?.name}`
      : "",
  };
}

export default async function Home() {
  return (
    <HydrateClient>
      <Layout>
        <ListCopyPasta />
      </Layout>
    </HydrateClient>
  );
}
