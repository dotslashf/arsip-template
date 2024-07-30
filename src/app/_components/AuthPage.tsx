import { redirect } from "next/navigation";
import { SessionProvider } from "~/components/SessionContext";
import { getServerAuthSession } from "~/server/auth";

interface HOCAuthProps {
  children: JSX.Element | JSX.Element[] | string;
}
export default async function HOCAuth({ children }: HOCAuthProps) {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/auth/sign-in");
  } else {
    return <SessionProvider session={session}>{children}</SessionProvider>;
  }
}
