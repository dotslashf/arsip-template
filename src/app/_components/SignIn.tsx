"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Separator } from "~/components/ui/separator";

export default function SignInSocialProviders() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">👋 Selamat datang!</h1>
        <p className="text-sm text-muted-foreground">
          Masuk ke akun kamu pakai sosial media pilihanmu
        </p>
      </div>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signIn("twitter")}
        >
          <FontAwesomeIcon icon={faTwitter} className="mr-2 h-4 w-4" />
          Masuk dengan Twitter (X)
        </Button>
        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-2 text-sm text-muted-foreground">atau</span>
          <Separator className="flex-1" />
        </div>
        <Button variant="outline" className="w-full">
          <FontAwesomeIcon icon={faFacebook} className="mr-2 h-4 w-4" />
          Masuk dengan Facebook
        </Button>
      </div>
    </div>
  );
}
