import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";

import { GoogleAnalytics } from "@next/third-parties/google";
import { env } from "~/env";

export const metadata: Metadata = {
  title: {
    template: "%s | arsip-template",
    default: "arsip-template",
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
    title: "arsip-template",
    description: "platform buat nyimpan template (copypasta) netizen",
    url: `https://arsiptemplate.app/`,
    images: [
      {
        url: "https://arsiptemplate.app/api/og",
        width: 1200,
        height: 630,
        alt: "Cover",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "arsip-template",
    description: "platform buat nyimpan template (copypasta) netizen",
    creator: "@arsip-mim",
    images: [`https://arsiptemplate.app/api/og`],
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
        <meta
          name="google-adsense-account"
          content="ca-pub-6938265092429326"
        ></meta>
      </head>
      <body>
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
              maxWidth: "28rem",
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
