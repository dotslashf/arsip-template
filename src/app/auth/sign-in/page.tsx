import Brand from "~/components/Brand";
import { HydrateClient } from "~/trpc/server";
import SignInSocialProviders from "~/app/_components/SignInPage";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk ke akun anda",
};
export default async function SignIn() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-primary">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
          <Brand />
          <SignInSocialProviders />
        </div>
      </main>
    </HydrateClient>
  );
}
