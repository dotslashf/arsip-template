import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/HOCAuth";
import ProfilePage from "~/app/_components/Dashboard/ProfilePage";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Profile",
  description: "Dashboard | Profile",
};
export default async function DashboardProfile() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <ProfilePage />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
