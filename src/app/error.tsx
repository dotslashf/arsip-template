"use client";

import { Flame, Home } from "lucide-react";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Flame className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Wah error 🤯
        </h1>
        <p className="mt-4 text-muted-foreground">
          Lagi ada error! Tenang aja, balik ke halaman utama ya!
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Kembali ke Beranda <Home className="ml-2 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
