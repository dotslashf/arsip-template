import { Package, PencilLine } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface HeroProps {
  texts: string[];
}
export default function Hero({ texts }: HeroProps) {
  const getRandomText = () => {
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex] + " ";
  };

  return (
    <div className="relative flex min-h-96 w-full items-center justify-center overflow-hidden rounded-lg bg-white text-gray-900 transition-colors duration-300 dark:bg-card dark:text-white">
      {/* Background with infinite running text */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -top-3 transform">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`${i % 2 === 0 ? "animate-scrollText" : "animate-scrollTextReverse"} whitespace-nowrap text-sm font-semibold text-slate-800 text-opacity-20 dark:text-white/15`}
            >
              {getRandomText()?.repeat(20)}
            </div>
          ))}
        </div>
        {/* Gradient overlay for fading effect on both sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-card dark:via-transparent dark:to-card"></div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-card dark:via-transparent dark:to-card"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-4 text-center">
        <h1 className="mb-4 flex items-center justify-center bg-white bg-gradient-to-br from-primary via-primary/90 to-primary/80 bg-clip-text text-left text-3xl font-bold text-transparent lg:text-5xl">
          <Package className="mr-1 h-5 w-5 text-primary lg:mr-3 lg:h-9 lg:w-9" />
          arsip
          <br />
          template
        </h1>
        <p className="text-md mx-auto max-w-2xl font-bold dark:text-white lg:text-xl">
          platform untuk berbagi template (copy-pasta) menarik dari netizen 🇮🇩.
        </p>
        <div className="mt-6">
          <Link
            href={"#main"}
            className={cn(
              buttonVariants({ variant: "destructive", size: "lg" }),
            )}
          >
            Mulai Mencari
            <PencilLine className="ml-2 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
