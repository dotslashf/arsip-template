import { getServerAuthSession } from "~/server/auth";
import Footer from "./Footer";
import React, { cloneElement, type ReactElement } from "react";
import { type Session } from "next-auth";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";

const Navbar = dynamic(() => import("./Navbar"), {
  ssr: false,
  loading() {
    return (
      <nav className="fixed inset-x-0 top-0 z-50 bg-white py-1 shadow dark:bg-card">
        <div className="container max-w-4xl p-0">
          <div className="flex h-12 items-center">
            <Skeleton className="h-9 w-9 rounded-md md:w-20" />
            <nav className="ml-auto flex items-center space-x-4">
              <Skeleton className="h-9 w-9 rounded-md md:w-20" />
            </nav>
          </div>
        </div>
      </nav>
    );
  },
});

interface LayoutProps {
  children:
    | ReactElement<{ session: Session | null }>
    | ReactElement<{ session: Session | null }>[];
}
export default async function Layout(props: LayoutProps) {
  const session = await getServerAuthSession();

  const childrenWithSession = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return cloneElement(child, { session });
    }
    return child;
  });
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar session={session} />
      <div className="container mb-auto px-4 pb-10 pt-20 lg:px-[6.5rem] lg:pt-24">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-10 lg:gap-y-14">
          {childrenWithSession}
        </div>
      </div>
      <Footer />
    </main>
  );
}
