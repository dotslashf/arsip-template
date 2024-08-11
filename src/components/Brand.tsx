import { Package } from "lucide-react";
import Link from "next/link";

export default function Brand() {
  return (
    <Link href={"/"}>
      <h1 className="flex items-center justify-center text-3xl font-bold leading-7 text-primary">
        <Package className="mr-3" />
        arsip
        <br />
        template
      </h1>
    </Link>
  );
}
