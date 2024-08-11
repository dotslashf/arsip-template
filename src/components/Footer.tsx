"use client";

import { FeedbackFish } from "@feedback-fish/react";
import { Dot } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { type Session } from "next-auth";

interface FooterProps {
  session: Session | null;
}
export default function Footer({ session }: FooterProps) {
  return (
    <footer className="w-full bg-white py-6 shadow dark:bg-card">
      <div className="container flex items-center justify-center gap-4 px-4 md:px-6">
        <div className="flex w-full items-center gap-4">
          <Link
            href="/tos"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Ketentuan Layanan
          </Link>
          <Dot className="hidden w-4 lg:block" />
          <Link
            href="/privacy-policy"
            className="text-sm hover:underline"
            prefetch={false}
          >
            Kebijakan Privasi
          </Link>
          {session && (
            <div className="ml-auto">
              <FeedbackFish projectId="ee2e6f2b856911" userId={session.user.id}>
                <Button>Send feedback</Button>
              </FeedbackFish>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
