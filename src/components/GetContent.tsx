import { ArrowDown, LoaderCircle, Skull } from "lucide-react";

interface GetContentProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
}
export default function GetContent({
  hasNextPage,
  isFetchingNextPage,
}: GetContentProps) {
  if (isFetchingNextPage) {
    return (
      <span className="flex items-center">
        Sedang Memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
      </span>
    );
  } else if (hasNextPage) {
    return (
      <span className="flex items-center">
        Muat Lebih Banyak <ArrowDown className="ml-2 h-4 w-4" />
      </span>
    );
  } else {
    return (
      <span className="flex items-center">
        Tidak Ada Template Lagi <Skull className="ml-2 h-4 w-4" />
      </span>
    );
  }
}
