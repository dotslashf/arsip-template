"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { type Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Avatar from "boring-avatars";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white py-1 shadow dark:bg-gray-950">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Avatar
                      name={session.user.id}
                      colors={[
                        "#0f172a",
                        "#A6AEC1",
                        "#CFD5E1",
                        "#EDEDF2",
                        "#FCFDFF",
                      ]}
                      size={38}
                      variant="beam"
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      href="/dashboard/profile"
                      prefetch={false}
                      className="flex w-full justify-between"
                    >
                      Profile
                      <UserRound className="w-3" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer bg-destructive text-destructive-foreground focus:bg-destructive/70 focus:text-white">
                    <span
                      className="flex w-full justify-between"
                      onClick={() => signOut()}
                    >
                      Keluar
                      <LogOut className="w-3" />
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}
