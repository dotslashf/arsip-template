import { type OriginSource } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { api } from "~/trpc/react";
import CardMinimal from "../CopyPasta/CardMinimal";
import { Button } from "~/components/ui/button";
import { trackEvent } from "~/lib/track";
import { ArrowRight } from "lucide-react";

export default function Lists() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const tag = searchParams.get("tag");
  const byUserId = searchParams.get("byUserId");
  const source = searchParams.get("source") as OriginSource;
  const [{ pages }] = api.copyPasta.list.useSuspenseInfiniteQuery(
    {
      limit: 5,
      search,
      tag,
      byUserId,
      source,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const router = useRouter();

  async function handleMore() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "next",
      path: "/",
    });
    router.push("/copy-pasta");
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

      <Button onClick={handleMore}>
        Lihat Lebih Banyak <ArrowRight className="ml-2 w-4" />
      </Button>
    </div>
  );
}
