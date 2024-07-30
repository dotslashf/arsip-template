import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/app/_components/AuthPage";
import ProfilePage from "~/app/_components/ProfilePage";

export default async function Profile() {
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
