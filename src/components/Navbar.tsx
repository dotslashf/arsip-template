"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { LogIn, LogOut, Medal, PlusIcon, UserRound } from "lucide-react";
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
import { avatarColorsTheme } from "~/lib/constant";
import { useMediaQuery } from "@uidotdev/usehooks";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  function handleSignOut() {
    sendGAEvent("event", "buttonClicked", { value: `signOut` });
    void signOut();
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white py-1 shadow dark:bg-card">
      <div className="container px-4 lg:px-[6.5rem]">
        <div className="flex h-12 items-center">
          <nav className="ml-auto flex items-center space-x-4">
            {isSmallDevice ? (
              <ButtonRanking />
            ) : (
              <ButtonRanking>Leaderboard</ButtonRanking>
            )}
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
                <LogIn className="ml-2 w-4" />
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Avatar
                      name={session.user.id}
                      colors={avatarColorsTheme}
                      size={38}
                      variant="beam"
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-44">
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
                      <UserRound className="w-4" />
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
                      <PlusIcon className="w-4" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={cn(
                      buttonVariants({ variant: "destructive" }),
                      "w-full items-center",
                    )}
                    onClick={handleSignOut}
                  >
                    <span className="flex w-full items-center justify-between">
                      Keluar
                      <LogOut className="w-4" />
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

function ButtonRanking({
  children,
}: {
  children?: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Link
      href={"/ranking"}
      className={cn(
        buttonVariants({ size: children ? "default" : "icon" }),
        "item-center",
      )}
    >
      {children}
      <Medal className={`w-4 ${children ? "ml-2" : null}`} />
    </Link>
  );
}
