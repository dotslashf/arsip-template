import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/app/_components/AuthPage";
import ProfilePage from "~/app/_components/ProfilePage";
import Brand from "~/components/Brand";

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
