"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { sendGAEvent } from "@next/third-parties/google";

export default function SignInSocialProviders() {
  function handleSignIn(platform: string) {
    sendGAEvent("event", "buttonClicked", { value: `signIn.${platform}` });
    void signIn(platform, {
      callbackUrl: "/",
    });
  }

  return (
    <>
      <Card className="mx-auto mt-8 w-full max-w-xl items-center justify-center space-y-6 bg-secondary py-6">
        <CardHeader className="items-center">
          <CardTitle className="text-3xl">👋 Selamat datang!</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full items-center justify-center">
          <p className="text-md max-w-sm text-center text-secondary-foreground">
            Masuk dan jadi bagian kontributor pengarsip template (copy-pasta)
            netizen
          </p>
        </CardContent>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant="twitter"
              className="w-full"
              size={"lg"}
              onClick={() => handleSignIn("twitter")}
            >
              <FontAwesomeIcon icon={faTwitter} className="mr-2 h-4 w-4" />
              Masuk dengan Twitter (X)
            </Button>
            <Button
              variant="discord"
              className="w-full"
              size={"lg"}
              onClick={() => handleSignIn("discord")}
            >
              <FontAwesomeIcon icon={faDiscord} className="mr-2 h-4 w-4" />
              Masuk dengan Discord
            </Button>
            <Button
              variant="google"
              className="w-full"
              size={"lg"}
              onClick={() => handleSignIn("google")}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
              Masuk dengan Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
