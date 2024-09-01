"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { sendGAEvent } from "@next/third-parties/google";
import { ANALYTICS_EVENT } from "~/lib/constant";

export default function SignInSocialProviders() {
  function handleSignIn(platform: string) {
    sendGAEvent("event", ANALYTICS_EVENT.BUTTON_CLICKED, {
      value: `signIn.${platform}`,
    });
    void signIn(platform, {
      callbackUrl: "/",
    });
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-xl items-center justify-center space-y-6 border-0 bg-accent px-4 py-6 shadow-none">
      <CardHeader className="items-center">
        <CardTitle className="text-3xl">👋 Halo, Selamat datang!</CardTitle>
        <CardDescription>
          Masuk dan jadi bagian kontributor pengarsip template (copy-pasta)
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col items-center justify-center self-center">
        <CardDescription className="mb-2 md:mb-4">
          Pilih metode untuk masuk ke akun Anda.
        </CardDescription>
        <div className="flex w-full flex-col space-y-2 md:space-y-4">
          <Button
            variant="twitter"
            className="w-full"
            size={"lg"}
            onClick={() => handleSignIn("twitter")}
          >
            <FontAwesomeIcon icon={faTwitter} className="mr-2 h-4 w-4" />
            Twitter (X)
          </Button>
          <Button
            variant="discord"
            className="w-full"
            size={"lg"}
            onClick={() => handleSignIn("discord")}
          >
            <FontAwesomeIcon icon={faDiscord} className="mr-2 h-4 w-4" />
            Discord
          </Button>
          <Button
            variant="google"
            className="w-full"
            size={"lg"}
            onClick={() => handleSignIn("google")}
          >
            <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
