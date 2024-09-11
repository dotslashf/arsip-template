import { ArrowDown, ArrowDownToLine, LoaderCircle } from "lucide-react";

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
        Sedang memuat <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
      </span>
    );
  } else if (hasNextPage) {
    return (
      <span className="flex items-center">
        Lihat lebih banyak <ArrowDown className="ml-2 h-4 w-4" />
      </span>
    );
  } else {
    return (
      <span className="flex items-center">
        Semua konten telah ditampilkan{" "}
        <ArrowDownToLine className="ml-2 h-4 w-4" />
      </span>
    );
  }
}
