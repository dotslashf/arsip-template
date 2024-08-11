import { getServerAuthSession } from "~/server/auth";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: JSX.Element | JSX.Element[] | string;
}
export default async function Layout(props: LayoutProps) {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Navbar session={session} />
      <div className="container mb-auto flex flex-col items-center justify-center gap-y-14 px-6 pb-10 pt-24 lg:px-[8.5rem]">
        {props.children}
      </div>
      <Footer session={session} />
    </main>
  );
}
