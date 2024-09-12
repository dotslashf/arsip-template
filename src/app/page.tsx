import Layout from "~/components/Layout";
import { api, HydrateClient } from "~/trpc/server";
import Hero from "~/components/Hero";
import { type Metadata } from "next";
import { baseUrl } from "~/lib/constant";
import { Homepage } from "./_components/Homepage";

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
  const copyPastas = await api.copyPasta.list({
    limit: 12,
  });
  const copyPastasFormatted = copyPastas.copyPastas
    .filter(
      (copy) =>
        !copy.CopyPastasOnTags.some((tag) => tag.tags.name === "ASCII Art"),
    )
    .map((copy) => {
      return {
        id: copy.id,
        content: copy.content,
        tags: copy.CopyPastasOnTags.map((tag) => tag.tags),
      };
    });

  return (
    <HydrateClient>
      <Layout>
        <Hero copyPastas={copyPastasFormatted} isShowButton={true} />
        <Homepage />
      </Layout>
    </HydrateClient>
  );
}
