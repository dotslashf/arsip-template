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
        <div className="container px-4 md:max-w-4xl lg:px-0">
          <div className="flex h-12 items-center">
            <Skeleton className="h-9 w-9 rounded-md md:w-20" />
            <nav className="ml-auto flex items-center gap-4">
              <Skeleton className="h-9 w-9 rounded-md md:w-20" />
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
      <div className="container mb-auto px-4 pb-10 pt-14 lg:px-[6.5rem] lg:pt-16">
        <div className="mx-auto mt-6 flex w-full max-w-4xl flex-col items-center justify-center gap-y-4 lg:mt-8">
          {childrenWithSession}
        </div>
      </div>
      <Footer />
    </main>
  );
}
