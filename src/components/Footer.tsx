import { Dot } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white py-6 shadow dark:bg-card">
      <div className="container flex max-w-7xl items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/tos"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Ketentuan Layanan
          </Link>
          <Dot className="w-4" />
          <Link
            href="/privacy-policy"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Kebijakan Privasi
          </Link>
        </div>
      </div>
    </footer>
  );
}
