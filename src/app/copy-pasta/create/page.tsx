import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPastaPage";
import Brand from "~/components/Brand";
import HOCAuth from "~/components/HOCAuth";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mari buat templatemu disini",
  description: "Halaman untuk membuat template",
};
export default async function CreateCopyPasta() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <CreateCopyPastaForm />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
