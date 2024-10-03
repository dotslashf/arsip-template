"use client";

import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/Common/BreadCrumbs";
import CardCollectionDescription from "~/components/Collection/CardCollectionDescription";
import GetContent from "~/components/Common/GetContent";
import { Button } from "~/components/ui/button";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { trackEvent } from "~/lib/track";
import { getBreadcrumbs } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function ListCollectionPage() {
  const [{ pages }, allCollections] =
    api.collection.list.useSuspenseInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCollections;

  async function handleNextList() {
    await fetchNextPage();
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "next_collection",
      path: "/collection",
    });
  }

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex w-full flex-col" id="main">
      <BreadCrumbs path={breadcrumbs} />
      <div className="flex w-full flex-col gap-4 self-center">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
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
                    />
                  );
                }),
              )
            : null}
        </div>
        <Button
          onClick={handleNextList}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          <GetContent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </Button>
      </div>
    </div>
  );
}
