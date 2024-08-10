"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LogIn, LogOut, Package, PlusIcon, UserRound } from "lucide-react";
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
import { ToggleTheme } from "./ToggleTheme";
import { sendGAEvent } from "@next/third-parties/google";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white py-1 shadow dark:bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex h-12 items-center">
          <Link
            href="/"
            className="mr-auto flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
          >
            <span className="font-bold">
              <Package />
            </span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4">
            <ToggleTheme />
            {!session?.user ? (
              <Link
                href="/auth/sign-in"
                className={cn(buttonVariants({ variant: "link" }))}
                prefetch={false}
                onClick={() => {
                  sendGAEvent("event", "buttonClicked", {
                    value: "signIn",
                  });
                }}
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
                  <DropdownMenuItem
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full items-center",
                    )}
                  >
                    <Link
                      href="/dashboard/profile"
                      prefetch={false}
                      className="flex w-full items-center justify-between"
                      onClick={() =>
                        sendGAEvent("event", "buttonClicked", {
                          value: "profile",
                        })
                      }
                    >
                      Profile
                      <UserRound className="w-3" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full items-center",
                    )}
                  >
                    <Link
                      href="/copy-pasta/create"
                      prefetch={false}
                      className="flex w-full items-center justify-between"
                      onClick={() =>
                        sendGAEvent("event", "buttonClicked", {
                          value: "create.copyPasta",
                        })
                      }
                    >
                      Tambah
                      <PlusIcon className="w-3" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={cn(
                      buttonVariants({ variant: "destructive" }),
                      "w-full items-center",
                    )}
                  >
                    <span
                      className="flex w-full items-center justify-between"
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
