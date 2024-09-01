import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { LoaderCircle, PlusIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn, trimContent } from "~/lib/utils";
import { sendGAEvent } from "@next/third-parties/google";
import { api } from "~/trpc/react";
import { type CopyPasta } from "@prisma/client";
import { useMediaQuery, useDebounce } from "@uidotdev/usehooks";
import { ANALYTICS_EVENT } from "~/lib/constant";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<CopyPasta[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(query, 500);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchMutation = api.copyPasta.search.useMutation();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  useEffect(() => {
    const searchQuery = async () => {
      setIsSearching(true);
      let queryResult: CopyPasta[] = [];
      if (query) {
        const data = await searchMutation.mutateAsync({ query });
        queryResult = data;
      }

      setIsSearching(false);
      setResults(queryResult);
      setIsSearchOpen(true);
    };

    void searchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSubmit = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("search", query);
    sendGAEvent("event", ANALYTICS_EVENT.SEARCH, {
      value: currentParams.get("search"),
    });
    setIsSearchOpen(false);
    router.push(`?${currentParams.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl items-center justify-center self-center">
      <div className="flex w-full items-center space-x-4 self-center">
        <div className="relative flex flex-1">
          <Input
            type="search"
            placeholder="Cari template..."
            className="flex-1 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
          />
          {isSearching && (
            <div className="absolute z-10 mt-14 flex w-full items-center justify-center rounded-md border bg-primary-foreground px-3 py-2 dark:text-accent">
              <LoaderCircle className="w-4 animate-spin" />
            </div>
          )}
          {results.length > 0 && isSearchOpen && (
            <ul
              className="absolute z-10 mt-14 flex w-full flex-col space-y-1 rounded-md border bg-primary-foreground shadow-md"
              onMouseDown={(e) => e.preventDefault()}
            >
              {results.map((result, index) => (
                <Link
                  href={`/copy-pasta/${result.id}`}
                  key={index}
                  className="cursor-pointer rounded-md px-4 py-2 transition-colors hover:bg-secondary dark:text-accent dark:hover:bg-accent-foreground"
                >
                  {trimContent(result.content, 100)}
                </Link>
              ))}
            </ul>
          )}
        </div>
        {isSmallDevice ? (
          <>
            <ButtonSearch onClick={handleSubmit} />
            <ButtonPlus />
          </>
        ) : (
          <div className="space-x-2">
            <ButtonSearch onClick={handleSubmit}>Cari</ButtonSearch>
            <ButtonPlus>Tambah</ButtonPlus>
          </div>
        )}
      </div>
    </div>
  );
}

interface ButtonInterface {
  onClick: () => void;
  children?: JSX.Element | JSX.Element[] | string;
}
function ButtonSearch({ children, onClick }: ButtonInterface) {
  return (
    <Button
      type="submit"
      size={children ? "default" : "icon"}
      variant="secondary"
      onClick={onClick}
    >
      {children}
      <Search className={`h-4 w-4 ${children ? "ml-2" : null}`} />
      <span className="sr-only">Search</span>
    </Button>
  );
}

function ButtonPlus({
  children,
}: {
  children?: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Link
      href={"/copy-pasta/create"}
      className={cn(
        buttonVariants({ size: children ? "default" : "icon" }),
        "item-center",
      )}
      onClick={() => {
        sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
          value: "create",
        });
      }}
    >
      {children}
      <PlusIcon className={`h-4 w-4 ${children ? "ml-2" : null}`} />
    </Link>
  );
}
