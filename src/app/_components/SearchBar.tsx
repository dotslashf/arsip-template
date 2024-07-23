import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { SearchIcon } from "~/components/ui/icons"

export default function SearchBar() {
    return (
        <div className="col-span-2 w-full">
            <div className="flex col-span-2 items-center space-x-2">
                <Input type="search" placeholder="Ini template bukan sih?..." className="flex-1" />
                <Button type="submit" variant="outline" size="icon">
                    <SearchIcon />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
        </div>
    )
}