"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  ChartNoAxesCombined,
  HandCoins,
  LogIn,
  LogOut,
  Medal,
  Package,
  PlusIcon,
  UserRound,
} from "lucide-react";
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
import { ToggleTheme } from "./ToggleTheme";
import { useMediaQuery } from "@uidotdev/usehooks";
import Avatar from "./ui/avatar";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { trackEvent } from "~/lib/track";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  function handleSignOut() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "navbar",
      value: "signOut",
    });
    void signOut();
  }

  function handleSignIn() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "navbar",
      value: "signIn",
    });
  }

  function handleProfile() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "navbar",
      value: "profile",
    });
  }

  function handleStatistics() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "navbar",
      value: "statistics",
    });
  }

  function handleCreate() {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "navbar",
      value: "create",
    });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white py-1 shadow dark:bg-card">
      <div className="container mx-auto px-4 lg:px-[6.5rem]">
        <div className="mx-auto flex h-12 w-full max-w-4xl items-center">
          <Link
            href={"/"}
            className="flex items-center justify-center font-bold leading-4 text-primary"
          >
            <Package className="mr-1 w-6" />
            arsip
            <br />
            template
          </Link>
          <nav className="ml-auto flex items-center space-x-2">
            {isSmallDevice ? (
              <>
                <ButtonRanking />
                <ButtonSupport />
              </>
            ) : (
              <>
                <ButtonRanking>Leaderboard</ButtonRanking>
                <ButtonSupport>Support</ButtonSupport>
              </>
            )}
            <ToggleTheme />
            {!session?.user ? (
              isSmallDevice ? (
                <ButtonSignIn onClick={handleSignIn} />
              ) : (
                <ButtonSignIn onClick={handleSignIn}>Masuk</ButtonSignIn>
              )
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="rounded-full border border-secondary-foreground">
                    <Avatar
                      seed={
                        session?.user.avatarSeed ?? session?.user.id ?? "Anon"
                      }
                      size={{
                        height: 40,
                        width: 40,
                      }}
                      zoom={130}
                    />
                    <span className="sr-only">Toggle user menu</span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2 w-44">
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full items-center",
                    )}
                  >
                    <Link
                      href="/dashboard/profile"
                      prefetch={false}
                      className="flex w-full items-center justify-between"
                      onClick={handleProfile}
                    >
                      Profile
                      <UserRound className="w-4" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full items-center",
                    )}
                  >
                    <Link
                      href="/statistics"
                      prefetch={false}
                      className="flex w-full items-center justify-between"
                      onClick={handleStatistics}
                    >
                      Statistik
                      <ChartNoAxesCombined className="w-4" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "w-full items-center",
                    )}
                  >
                    <Link
                      href="/copy-pasta/create"
                      prefetch={false}
                      className="flex w-full items-center justify-between"
                      onClick={handleCreate}
                    >
                      Tambah
                      <PlusIcon className="w-4" />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
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

function ButtonSupport({
  children,
}: {
  children?: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Link
      href={"/support"}
      className={cn(
        buttonVariants({
          size: children ? "default" : "icon",
          variant: "gold",
        }),
        "item-center",
      )}
    >
      {children}
      <HandCoins className={`w-4 ${children ? "ml-2" : null}`} />
    </Link>
  );
}

function ButtonSignIn({
  children,
  onClick,
}: {
  onClick: () => void;
  children?: JSX.Element | JSX.Element[] | string;
}) {
  return (
    <Link
      href="/auth/sign-in"
      className={cn(
        buttonVariants({
          size: children ? "default" : "icon",
          variant: "secondary",
        }),
        "item-center",
      )}
      onClick={onClick}
    >
      {children}
      <LogIn className={`w-4 ${children ? "ml-2" : null}`} />
    </Link>
  );
}
