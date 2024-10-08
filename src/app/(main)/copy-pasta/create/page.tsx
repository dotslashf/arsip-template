import Layout from "~/components/Common/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPastaPage";
import HOCAuth from "~/components/Common/HOCAuth";

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
