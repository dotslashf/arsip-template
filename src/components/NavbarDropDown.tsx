import {
  Library,
  LogIn,
  LogOut,
  MonitorSmartphone,
  Moon,
  NotebookPen,
  Palette,
  Plus,
  Sun,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@uidotdev/usehooks";
import { trackEvent } from "~/lib/track";
import { ANALYTICS_EVENT } from "~/lib/constant";
import { type Session } from "next-auth";
import Avatar from "./ui/avatar";
import { signOut } from "next-auth/react";

interface NavbarDropDownProps {
  session: Session | null;
}
export default function NavbarDropDown({ session }: NavbarDropDownProps) {
  const { setTheme } = useTheme();
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  function handleSetTheme(theme: "light" | "dark" | "system") {
    setTheme(theme);
    void trackEvent(
      ANALYTICS_EVENT.SET_THEME,
      {
        value: theme,
        is_small_device: isSmallDevice,
      },
      session?.user.id,
    );
  }

  function handleSignOut() {
    void trackEvent(
      ANALYTICS_EVENT.BUTTON_CLICKED,
      {
        button: "navbar",
        value: "sign_out",
      },
      session?.user.id,
    );
    void signOut({
      callbackUrl: "/",
    });
  }

  function handleProfile() {
    void trackEvent(
      ANALYTICS_EVENT.BUTTON_CLICKED,
      {
        button: "navbar",
        value: "profile",
      },
      session?.user.id,
    );
  }

  function handleCreate() {
    void trackEvent(
      ANALYTICS_EVENT.BUTTON_CLICKED,
      {
        button: "navbar",
        value: "create",
      },
      session?.user.id,
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isSmallDevice ? "icon" : "default"}>
          <span className="hidden md:inline">Profil</span>
          <User className="h-4 w-4 md:ml-2" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {session?.user ? (
          <>
            <div className="flex items-center px-2 py-2">
              <span className="mr-2 rounded-full">
                <Avatar
                  seed={session?.user.avatarSeed ?? session?.user.id ?? "Anon"}
                  size={{
                    height: 40,
                    width: 40,
                  }}
                  zoom={130}
                />
                <span className="sr-only">Toggle user menu</span>
              </span>
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Dashboard</DropdownMenuLabel>
            <DropdownMenuItem asChild onClick={handleProfile}>
              <Link href="/dashboard/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/copy-pasta" className="flex items-center">
                <NotebookPen className="mr-2 h-4 w-4" />
                Template
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/collection" className="flex items-center">
                <Library className="mr-2 w-4" />
                Koleksi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Plus className="mr-2 h-4 w-4" />
                <span>Tambah</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild onClick={() => handleCreate()}>
                    <Link
                      href="/copy-pasta/create"
                      className="flex items-center"
                    >
                      <NotebookPen className="mr-2 h-4 w-4" />
                      Template
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/collection/create"
                      className="flex items-center"
                    >
                      <Library className="mr-2 w-4" />
                      Koleksi
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-in" className="flex items-center">
                <LogIn className="mr-2 w-4" />
                Masuk
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Tema</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleSetTheme("light")}>
                <Sun className="mr-2 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSetTheme("dark")}>
                <Moon className="mr-2 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSetTheme("system")}>
                <MonitorSmartphone className="mr-2 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {session?.user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={handleSignOut}>
              <div className="flex items-center">
                <LogOut className="mr-2 w-4" />
                Keluar
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
