import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/HOCAuth";
import ProfilePage from "~/app/_components/ProfilePage";
import Brand from "~/components/Brand";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Profile",
  description: "Dashboard | Profile",
};
export default async function Profile() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <Brand />
          <ProfilePage />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
