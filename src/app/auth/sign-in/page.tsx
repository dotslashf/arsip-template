import Brand from "~/components/Brand";
import { api, HydrateClient } from "~/trpc/server";
import SignInSocialProviders from "~/app/_components/SignInPage";
import { type Metadata } from "next";
import { baseUrl } from "~/lib/constant";
import Hero from "~/components/Hero";

export const metadata: Metadata = {
  title: "Masuk ke akun anda",
  alternates: {
    canonical: `${baseUrl}/auth/sign-in`,
  },
};
export default async function SignIn() {
  const copyPastas = await api.copyPasta.list({
    limit: 10,
  });
  const texts = copyPastas.copyPastas.map((copy) => copy.content);

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background md:flex-row md:items-stretch">
        <div className="mb-8 w-full max-w-3xl self-center md:mb-0 md:mr-6 md:w-3/5">
          <Hero texts={texts} isShowButton={false} />
        </div>
        <div className="flex w-full items-center justify-center bg-accent md:w-2/5">
          <SignInSocialProviders />
        </div>
      </div>
    </HydrateClient>
  );
}
