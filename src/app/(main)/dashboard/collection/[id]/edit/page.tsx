import Layout from "~/components/Common/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/Common/HOCAuth";

import type { Metadata } from "next";
import EditCollectionPage from "~/app/_components/Dashboard/EditCollectionPage";

export type PropsPage = {
  params: { id: string };
};
export const metadata: Metadata = {
  title: "Mari buat koleksi templatemu disini",
  description: "Halaman untuk membuat koleksi template",
};
export default async function EditCollection({ params }: PropsPage) {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <EditCollectionPage id={params.id} />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
