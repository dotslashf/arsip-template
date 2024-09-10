import { Input } from "~/components/ui/input";
import { LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { trackEvent } from "~/lib/track";
import { CardCopyPastaMinimal } from "~/lib/interface";

interface SearchBarProps {
  onSearchResults: (results: CardCopyPastaMinimal[]) => void;
  onLoadingState: (isLoading: boolean) => void;
}

export default function SearchBar({ onSearchResults, onLoadingState }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(query, 500);

  const searchMutation = api.copyPasta.search.useMutation();

  useEffect(() => {
    const searchQuery = async () => {
      setIsSearching(true);
      onLoadingState(true); // Notify parent that loading has started
      let queryResult: CardCopyPastaMinimal[] = [];
      if (query) {
        const data = await searchMutation.mutateAsync({ query });
        queryResult = data;
      }

      setIsSearching(false);
      onLoadingState(false); // Notify parent that loading has ended
      onSearchResults(queryResult); // Pass the results to the parent
    };

    void searchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSubmit = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("search", query);
    void trackEvent(ANALYTICS_EVENT.SEARCH, {
      value: currentParams.get("search") ?? "",
    });
    router.push(
      `?${currentParams.toString()}&utm_term=${encodeURIComponent(query)}`,
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full items-center justify-center self-center">
      <div className="flex w-full items-center space-x-2 self-center">
        <div className="relative flex flex-1">
          <Input
            type="search"
            placeholder="Cari template..."
            className="flex-1 shadow-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {isSearching && (
            <div className="absolute z-10 mt-14 flex w-full items-center justify-center rounded-md border bg-primary-foreground px-3 py-2 dark:text-accent">
              <LoaderCircle className="w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
