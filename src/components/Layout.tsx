import { getServerAuthSession } from "~/server/auth";
import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { cloneElement, type ReactElement } from "react";
import { type Session } from "next-auth";

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
      <div className="container mb-auto flex flex-col items-center justify-center gap-y-14 px-6 pb-10 pt-24 lg:px-[8.5rem]">
        {childrenWithSession}
      </div>
      <Footer session={session} />
    </main>
  );
}
