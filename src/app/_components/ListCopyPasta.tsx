"use client";

import { useSearchParams } from "next/navigation";
import CopyPastaCard from "~/components/CopyPastaCard";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import SearchBar from "./SearchBar";
import { ArrowDownIcon, LoaderCircleIcon, SkullIcon } from "~/components/ui/icons";


export function ListCopyPasta() {
    const searchParams = useSearchParams();
    const search = searchParams.get("search");
    const tag = searchParams.get("tag");
    const [{ pages, }, allCopyPastas] = api.copyPasta.list.useSuspenseInfiniteQuery({
        limit: 3,
        search,
        tag,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
        allCopyPastas;

    return (
        <div className="flex flex-col gap-4">
            <div className="grid lg:grid-cols-2 gap-4">
                <SearchBar />
                {pages ? pages.map(page =>
                    page.copyPastas.map((copy) => {
                        const copyWithTags = {
                            ...copy,
                            tags: copy.CopyPastasOnTags.map(tag => tag.tags)
                        }
                        return <CopyPastaCard key={copy.id} copyPastaProps={copyWithTags} />
                    }
                    )
                ) : null}
            </div>
            <Button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                {isFetchingNextPage ? (
                    <span className="flex items-center">Sedang Memuat  <LoaderCircleIcon className="animate-spin ml-2" /></span>
                ) : hasNextPage ? (
                    <span className="flex items-center">Muat Lebih Banyak <ArrowDownIcon className="ml-2" /></span>
                ) : (
                    <span className="flex items-center">
                        Tidak Ada Template Lagi <SkullIcon className="ml-2" />
                    </span>
                )}
            </Button>
        </div>
    )
}