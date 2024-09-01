import { sendGAEvent } from "@next/third-parties/google";
import { type OriginSource } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { api } from "~/trpc/react";
import CardMinimal from "./CardMinimal";
import { Button } from "~/components/ui/button";
import GetContent from "../GetContent";

export default function Lists() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const byUserId = searchParams.get("byUserId");
  const source = searchParams.get("source") as OriginSource;
  const [{ pages }, allCopyPastas] =
    api.copyPasta.list.useSuspenseInfiniteQuery(
      {
        limit: 9,
        search,
        tag,
        byUserId,
        source,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { isFetchingNextPage, fetchNextPage, hasNextPage } = allCopyPastas;

  async function handleNextList() {
    await fetchNextPage();
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: "home.next",
    });
  }

  return (
    <div className="order-last col-span-3 flex flex-col gap-4 md:order-first md:col-span-2">
      {pages
        ? pages.map((page) =>
            page.copyPastas.map((copy) => {
              return <CardMinimal key={copy.id} copyPasta={copy} />;
            }),
          )
        : null}

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
  );
}
