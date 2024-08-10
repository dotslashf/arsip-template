import { Input } from "~/components/ui/input";
import { Button, buttonVariants } from "~/components/ui/button";
import { PlusIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { sendGAEvent, sendGTMEvent } from "@next/third-parties/google";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set("search", query);
    sendGAEvent("event", "search", { value: currentParams.get("search") });
    // sendGTMEvent({ event: "search", value: currentParams.get("search") });
    router.push(`?${currentParams.toString()}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="col-span-2 w-full">
      <div className="col-span-2 flex items-center space-x-2">
        <Input
          type="search"
          placeholder="Cari template..."
          className="flex-1 shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          variant="secondary"
          onClick={handleSearch}
          className="hidden lg:flex"
        >
          <Search className="mr-2 h-4 w-4" />
          Cari
          <span className="sr-only">Search</span>
        </Button>
        <Button
          type="submit"
          size={"icon"}
          variant="secondary"
          onClick={handleSearch}
          className="flex lg:hidden"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <Link
          href={"/copy-pasta/create"}
          className={cn(buttonVariants({}), "item-center")}
          onClick={() => {
            sendGAEvent("event", "buttonClicked", {
              value: "create.copyPasta",
            });
            // sendGTMEvent({ event: "buttonClicked", value: "create.copyPasta" });
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Tambah
        </Link>
      </div>
    </div>
  );
}
