"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { type Session } from "next-auth";
import NavbarDropDown from "./NavbarDropDown";
import NavbarDropDownNavigation from "./NavbarDropDownNavigation";
import { RainbowButton } from "./magicui/rainbow-button";
import Lottie from 'react-lottie-player'
import { api } from "~/trpc/react";


interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const { data: streak } = api.user.getStreakInfo.useQuery({ id: session?.user.id }, {
    enabled: !!session
  })

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/30 py-1 shadow-md backdrop-blur-md backdrop-saturate-150 dark:bg-card/30">
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
            {session && (
              <RainbowButton>
                <Lottie
                  path="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json"
                  play
                  loop
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                {streak?.currentStreak ?? 0} streak</RainbowButton>
            )}
            <NavbarDropDown session={session} />
            <NavbarDropDownNavigation />
          </nav>
        </div>
      </div>
    </nav>
  );
}
