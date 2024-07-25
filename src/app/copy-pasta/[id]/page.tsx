import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CopyPasta from "~/app/_components/CopyPastaById";
import Brand from "~/app/_components/Brand";

export default function CopyPastaById({ params }: { params: { id: string } }) {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <CopyPasta id={params.id} />
      </Layout>
    </HydrateClient>
  );
}
