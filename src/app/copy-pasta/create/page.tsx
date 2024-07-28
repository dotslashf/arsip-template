import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPastaPage";
import Brand from "~/components/Brand";
import HOCAuth from "~/app/_components/AuthPage";

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
