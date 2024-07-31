import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { TRPCReactProvider } from "~/trpc/react";
import Script from "next/script";

export const metadata: Metadata = {
  title: {
    template: "%s | arsip-template",
    default: "📦 | arsip-template",
  },
  description: "platform buat nyimpan template (copypasta) netizen",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-2Q26HEWB87"
        ></Script>
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-2Q26HEWB87');
          `}
        </Script>
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
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
