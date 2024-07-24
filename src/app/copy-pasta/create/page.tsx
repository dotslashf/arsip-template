import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CreateCopyPastaForm from "~/app/_components/CreateCopyPasta";

export default function CreateCopyPasta() {
    return (
        <HydrateClient>
            <Layout>
                <CreateCopyPastaForm />
            </Layout>
        </HydrateClient>
    )
}