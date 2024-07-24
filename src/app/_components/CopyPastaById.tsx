"use client";

import CopyPastaCard from "~/components/CopyPastaCard";
import { api } from "~/trpc/react";

interface CopyPastaByIdProps {
    id: string
}
export default function CopyPastaById({ id }: CopyPastaByIdProps) {
    const [copyPasta] = api.copyPasta.byId.useSuspenseQuery({
        id: id
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
                {copyPasta ? <CopyPastaCard key={id} copyPastaProps={{
                    ...copyPasta,
                    fullMode: true
                }} /> : <div></div>}
            </div>
        </div>
    )
}