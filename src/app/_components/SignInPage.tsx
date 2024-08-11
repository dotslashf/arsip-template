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

export default function SignInSocialProviders() {
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
              onClick={() =>
                signIn("twitter", {
                  callbackUrl: "/",
                })
              }
            >
              <FontAwesomeIcon icon={faTwitter} className="mr-2 h-4 w-4" />
              Masuk dengan Twitter (X)
            </Button>
            <Button
              variant="discord"
              className="w-full"
              size={"lg"}
              onClick={() =>
                signIn("discord", {
                  callbackUrl: "/",
                })
              }
            >
              <FontAwesomeIcon icon={faDiscord} className="mr-2 h-4 w-4" />
              Masuk dengan Discord
            </Button>
            <Button
              variant="google"
              className="w-full"
              size={"lg"}
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/",
                })
              }
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
