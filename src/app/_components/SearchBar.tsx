import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { SearchIcon } from "~/components/ui/icons"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function SearchBar() {
    const [query, setQuery] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = () => {
        const currentParams = new URLSearchParams(searchParams);
        currentParams.set('search', query);
        router.push(`?${currentParams.toString()}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className="col-span-2 w-full">
            <div className="flex col-span-2 items-center space-x-2">
                <Input type="search" placeholder="Ini template bukan sih?..." className="flex-1" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} />
                <Button type="submit" variant="outline" size="icon" onClick={handleSearch}>
                    <SearchIcon />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
        </div>
    )
}