import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/HOCAuth";
import { type Metadata } from "next";
import CollectionPage from "~/app/_components/Dashboard/CollectionPage";

export const metadata: Metadata = {
  title: "Dashboard | Collection",
  description: "Dashboard | Collection",
};
export default async function DashboardCopyPasta() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <CollectionPage />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}