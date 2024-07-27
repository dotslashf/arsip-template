import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPasta";
import Brand from "~/app/_components/Brand";
import HOCAuth from "~/app/_components/Auth";

export default async function CreateCopyPasta() {
  return (
    <HydrateClient>
      <HOCAuth>
        <Layout>
          <Brand />
          <CreateCopyPastaForm />
        </Layout>
      </HOCAuth>
    </HydrateClient>
  );
}
