import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { env } from "~/env";
import { baseUrl } from "~/lib/constant";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";

export const metadata: Metadata = {
  title: {
    template: "%s | arsip template",
    default: "arsip template",
  },
  description:
    "Sebuah platform untuk menyimpan dan berbagi template (copy-pasta) menarik dari netizen Indonesia.",
  icons: [
    {
      rel: "icon",
      url: "/favicon.png",
    },
  ],
  openGraph: {
    title: "arsip template",
    description: "platform buat nyimpan template (copypasta) netizen",
    url: `${baseUrl}`,
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: "Cover",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "arsip template",
    description: "platform buat nyimpan template (copypasta) netizen",
    creator: "@arsip-mim",
    images: [`${baseUrl}/api/og`],
  },
};

const isDevelopment = env.NODE_ENV === "development";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {!isDevelopment && <GoogleAnalytics gaId="G-2Q26HEWB87" />}
        {!isDevelopment && <GoogleTagManager gtmId="GTM-NG2RHJGW" />}
        {!isDevelopment && (
          <Script
            defer
            src="https://umami-arsip-template.koyeb.app/script.js"
            data-website-id="3d005c97-2e3d-4e52-be52-bf933e5b6efd"
          />
        )}
        <meta
          name="google-adsense-account"
          content="ca-pub-6938265092429326"
        ></meta>
      </head>
      <body>
        <NextTopLoader showSpinner={false} color="#4D7CDB" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              padding: "1rem",
              borderRadius: "0.375rem",
              width: "100%",
              maxWidth: "23.6rem",
            },
            iconTheme: {
              primary: "#0f172a",
              secondary: "#FCFDFF",
            },
          }}
        />
      </body>
    </html>
  );
}
