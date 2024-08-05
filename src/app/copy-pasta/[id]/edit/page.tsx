import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import EditCopyPastaForm from "~/app/_components/EditCopyPastaPage";
import Brand from "~/components/Brand";
import HOCAuth from "~/app/_components/AuthPage";

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
          <Brand />
          <EditCopyPastaForm id={params.id} />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
