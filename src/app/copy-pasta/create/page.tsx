import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPasta";
import Brand from "~/app/_components/Brand";

export default function CreateCopyPasta() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <CreateCopyPastaForm />
      </Layout>
    </HydrateClient>
  );
}
