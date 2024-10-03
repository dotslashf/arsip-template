"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { type Session } from "next-auth";
import NavbarDropDown from "./NavbarDropDown";
import NavbarDropDownNavigation from "./NavbarDropDownNavigation";
import { RainbowButton } from "../magicui/rainbow-button";
import Lottie from "react-lottie-player";
import { api } from "~/trpc/react";
import NumberTicker from "../magicui/number-ticker";
import { useRouter } from "next/navigation";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { trackEvent } from "~/lib/track";

interface NavbarProps {
  session: Session | null;
}

export default function Navbar({ session }: NavbarProps) {
  const { data: streak } = api.user.getStreakInfo.useQuery(
    { id: session?.user.id },
    {
      enabled: !!session,
    },
  );
  const router = useRouter();

  function handleStreak() {
    void trackEvent(
      ANALYTICS_EVENT.BUTTON_CLICKED,
      {
        button: "navbar",
        value: "streak",
      },
      session?.user.id,
    );
    router.push("/copy-pasta/create?utm_source=streak");
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/30 py-1 shadow-md backdrop-blur-md backdrop-saturate-150 dark:bg-card/30">
      <div className="container mx-auto px-4 lg:px-[6.5rem]">
        <div className="mx-auto flex h-12 w-full max-w-4xl items-center">
          <Link
            href={"/"}
            className="flex items-center justify-center font-bold leading-4 text-primary"
          >
            <Package className="w-6" />
          </Link>
          <nav className="ml-auto flex items-center space-x-2">
            {session && streak && (
              <RainbowButton onClick={handleStreak}>
                {streak.currentStreak > 0 ? (
                  <>
                    <Lottie
                      path="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json"
                      play
                      loop
                      className="mr-2 h-4 w-4"
                    />
                    <NumberTicker
                      value={streak?.currentStreak ?? 0}
                      className="mr-2"
                    />
                    streak
                  </>
                ) : (
                  <>
                    <Lottie
                      path="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json"
                      play
                      loop
                      className="mr-2 h-4 w-4"
                    />
                    Dapatkan streakmu!
                  </>
                )}
              </RainbowButton>
            )}
            <NavbarDropDown session={session} />
            <NavbarDropDownNavigation />
          </nav>
        </div>
      </div>
    </nav>
  );
}
