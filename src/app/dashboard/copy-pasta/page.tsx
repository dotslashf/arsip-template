import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/HOCAuth";
import { type Metadata } from "next";
import CopyPastaPage from "~/app/_components/Dashboard/CopyPastaPage";

export const metadata: Metadata = {
  title: "Dashboard | Copy Pasta",
  description: "Dashboard | Copy Pasta",
};
export default async function DashboardCopyPasta() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <CopyPastaPage />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
