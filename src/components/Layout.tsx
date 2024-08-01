import { getServerAuthSession } from "~/server/auth";
import Navbar from "./Navbar";

interface LayoutProps {
  children: JSX.Element | JSX.Element[] | string;
}
export default async function Layout(props: LayoutProps) {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar session={session} />
      <div className="container flex flex-col items-center justify-center gap-6 px-4 pb-16 pt-20 lg:px-36">
        {props.children}
      </div>
    </main>
  );
}
