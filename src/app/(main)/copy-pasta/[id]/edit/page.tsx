import Layout from "~/components/Common/Layout";
import { HydrateClient } from "~/trpc/server";
import EditCopyPastaForm from "~/app/_components/EditCopyPastaPage";
import HOCAuth from "~/components/Common/HOCAuth";

import type { Metadata } from "next";
import { type PropsPage } from "../page";

export const metadata: Metadata = {
  title: "Edit template",
};
export default async function EditCopyPasta({ params }: PropsPage) {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <EditCopyPastaForm id={params.id} />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
