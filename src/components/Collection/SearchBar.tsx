import { Input } from "~/components/ui/input";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useDebounce } from "@uidotdev/usehooks";
import { type CardCopyPastaMinimal } from "~/lib/interface";

interface SearchBarProps {
  onSearchResults: (results: CardCopyPastaMinimal[]) => void;
  onLoadingState: (isLoading: boolean) => void;
}

export default function SearchBar({
  onSearchResults,
  onLoadingState,
}: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const debouncedSearchTerm = useDebounce(query, 500);

  const searchMutation = api.copyPasta.search.useMutation();

  useEffect(() => {
    const searchQuery = async () => {
      onLoadingState(true); // Notify parent that loading has started
      let queryResult: CardCopyPastaMinimal[] = [];
      if (query) {
        const data = await searchMutation.mutateAsync({ query });
        queryResult = data;
      }

      onLoadingState(false); // Notify parent that loading has ended
      onSearchResults(queryResult); // Pass the results to the parent
    };

    void searchQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

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
          />
        </div>
      </div>
    </div>
  );
}
