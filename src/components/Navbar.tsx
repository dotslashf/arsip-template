"use client";

import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex h-12 items-center">
          <Link
            href="/"
            className="mr-auto flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
          >
            <span className="font-bold">i-t-b</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            {!session?.user ? (
              <Link
                href="/auth/sign-in"
                className={cn(buttonVariants({ variant: "link" }))}
                prefetch={false}
              >
                Masuk
                <LogIn className="ml-2 w-3" />
              </Link>
            ) : (
              <Button variant={"link"} onClick={() => signOut()}>
                Keluar
                <LogOut className="ml-2 w-3" />
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
