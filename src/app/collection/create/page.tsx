import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCollectionForm from "~/app/_components/CreateCollectionPage";
import HOCAuth from "~/components/HOCAuth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mari buat koleksi templatemu disini",
  description: "Halaman untuk membuat koleksi template",
};
export default async function CreateCollection() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <CreateCollectionForm />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
