import {
  ChartNoAxesColumn,
  HandCoins,
  House,
  Library,
  Medal,
  Menu,
  NotebookPen,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function NavbarDropDownNavigation() {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size={isSmallDevice ? "icon" : "default"}>
          <span className="hidden md:inline">Menu</span>
          <Menu className="h-4 w-4 md:ml-2" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Konten</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/" className="flex items-center">
            <House className="mr-2 w-4" />
            Beranda
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/copy-pasta" className="flex items-center">
            <NotebookPen className="mr-2 w-4" />
            Template
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/collection" className="flex items-center">
            <Library className="mr-2 w-4" />
            Koleksi
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Statistik & Dukungan</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/ranking" className="flex items-center">
            <Medal className="mr-2 w-4" />
            Peringkat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/statistics" className="flex items-center">
            <ChartNoAxesColumn className="mr-2 h-4 w-4" />
            Statistik
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/support" className="flex items-center">
            <HandCoins className="mr-2 w-4" />
            Beri Dukungan
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
