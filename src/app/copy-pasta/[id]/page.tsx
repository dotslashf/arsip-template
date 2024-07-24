import Link from "next/link";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import CopyPasta from "~/app/_components/CopyPastaById";

export default function CopyPastaById({ params }: { params: { id: string } }) {
    return (
        <HydrateClient>
            <Layout>
                <Link href={'/'}><h1 className="text-2xl font-bold">ini<br />template<br />bukan</h1></Link>
                <CopyPasta id={params.id} />
            </Layout>
        </HydrateClient>
    )
}