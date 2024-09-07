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
import { useMediaQuery } from "@uidotdev/usehooks";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { trackEvent } from "~/lib/track";

export function ToggleTheme() {
  const { setTheme } = useTheme();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  function handleSetTheme(theme: "light" | "dark" | "system") {
    setTheme(theme);
    void trackEvent(ANALYTICS_EVENT.SET_THEME, { value: theme, isSmallDevice });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={"icon"}>
          <Sun className={`h-4 w-4 dark:hidden`} />
          <Moon className={`hidden h-4 w-4 dark:block`} />
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
