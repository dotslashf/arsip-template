"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function SignInSocialProviders() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">👋 Selamat datang!</h1>
      </div>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() =>
            signIn("twitter", {
              callbackUrl: "/",
            })
          }
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2 h-4 w-4" />
          Masuk dengan Twitter (X)
        </Button>
      </div>
    </div>
  );
}
