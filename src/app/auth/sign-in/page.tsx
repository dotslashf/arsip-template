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
  const copyPastasFormatted = copyPastas.copyPastas.map((copy) => {
    return {
      content: copy.content,
      tags: copy.CopyPastasOnTags.map((tag) => tag.tags),
    };
  });

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 md:flex-row md:items-stretch md:p-0">
        <div className="mb-8 hidden w-full max-w-3xl self-center md:mb-0 md:mr-6 md:flex md:w-3/5">
          <Hero copyPastas={copyPastasFormatted} isShowButton={false} />
        </div>
        <div className="flex w-full items-center justify-center rounded-md bg-accent md:w-2/5">
          <SignInSocialProviders />
        </div>
      </div>
    </HydrateClient>
  );
}
