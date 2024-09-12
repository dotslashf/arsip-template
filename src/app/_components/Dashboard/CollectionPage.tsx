"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/BreadCrumbs";
import CardCollectionDescription from "~/components/Collection/CardCollectionDescription";
import EmptyState from "~/components/EmptyState";
import GetContent from "~/components/GetContent";
import { useSession } from "~/components/SessionContext";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn, getBreadcrumbs } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function CollectionPage() {
  const session = useSession();
  const [{ pages }, allCollections] =
    api.collection.byUserId.useSuspenseInfiniteQuery(
      {
        limit: 10,
        id: session!.user.id,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCollections;

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  const isCollectionExists =
    pages.flatMap((page) => page.collections).length !== 0;

  return (
    <div className="flex w-full flex-col items-start">
      <BreadCrumbs path={breadcrumbs} />
      {isCollectionExists ? (
        <div className="flex w-full flex-col gap-4">
          {pages
            ? pages.map((page) =>
                page.collections.map((collection) => {
                  return (
                    <CardCollectionDescription
                      key={collection.id}
                      id={collection.id}
                      createdAt={collection.createdAt}
                      description={collection.description}
                      name={collection.name}
                      createdBy={collection.createdBy}
                      isSingle={false}
                      count={collection._count.copyPastas}
                      isEditable={true}
                    />
                  );
                }),
              )
            : null}
          <Button
            className="w-full"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            <GetContent
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          </Button>
        </div>
      ) : (
        <EmptyState
          message="Kamu belum buat koleksi nih 😢"
          action={
            <Link
              href={"/collection/create"}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus className="mr-2 w-4" />
              Buat Yuk
            </Link>
          }
        />
      )}
    </div>
  );
}