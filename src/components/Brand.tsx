import { Package } from "lucide-react";
import Link from "next/link";

export default function Brand() {
  return (
    <Link href={"/"}>
      <h1 className="flex items-center justify-center text-2xl font-bold leading-5 text-primary lg:text-3xl lg:leading-7">
        <Package className="mr-1 w-5 lg:mr-3 lg:w-6" />
        arsip
        <br />
        template
      </h1>
    </Link>
  );
}
