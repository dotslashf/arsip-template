"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { sendGAEvent } from "@next/third-parties/google";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ANALYTICS_EVENT } from "~/lib/constant";

export function ToggleTheme() {
  const { setTheme } = useTheme();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  function handleSetTheme(theme: "light" | "dark" | "system") {
    setTheme(theme);
    sendGAEvent("event", ANALYTICS_EVENT.SET_THEME, { value: theme });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isSmallDevice ? "icon" : "default"}>
          {isSmallDevice ? "" : "Tema"}
          <Sun
            className={`h-4 w-4 dark:hidden ${!isSmallDevice ? "ml-2" : null}`}
          />
          <Moon
            className={`hidden h-4 w-4 dark:block ${!isSmallDevice ? "ml-2" : null}`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSetTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
