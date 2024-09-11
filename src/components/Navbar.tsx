"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { type Session } from "next-auth";
import NavbarDropDown from "./NavbarDropDown";
import NavbarDropDownNavigation from "./NavbarDropDownNavigation";

interface NavbarProps {
  session: Session | null;
}
export default function Navbar({ session }: NavbarProps) {
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
            <NavbarDropDown session={session} />
            <NavbarDropDownNavigation />
          </nav>
        </div>
      </div>
    </nav>
  );
}
