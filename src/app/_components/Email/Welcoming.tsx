import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  name: string;
  previewText: string;
}

export const WelcomeEmail = ({ name, previewText }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Tailwind>
      <Body className="mx-auto my-auto font-sans text-slate-900">
        <Section className="mx-auto max-w-2xl bg-white px-6 py-8">
          <header>
            <Heading className="flex items-center text-2xl font-bold leading-5 text-[#4D7CDB]">
              arsip
              <br />
              template
            </Heading>
          </header>

          <main className="mt-8">
            <h2 className=" ">Hi {name},</h2>

            <Text className="mt-2 leading-loose">
              Selamat datang di arsip-template.
              <br />
              Platform template (copy-pasta) nya netizen Indonesia 🇮🇩.
            </Text>

            <Section className="flex">
              <Button
                href="https://arsiptemplate.app"
                className="mt-2 inline-flex items-center justify-center rounded-md bg-[#4D7CDB] px-6 py-3 text-base font-semibold text-white"
              >
                Mulai mengarsipkan
              </Button>
            </Section>
            <Section className="flex">
              <Button
                href="https://arsiptemplate.app/copy-pasta#main"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-slate-100 px-6 py-3 text-base font-semibold text-[#4d7cdb]"
              >
                Cari template
              </Button>
            </Section>
          </main>

          <footer className="mt-8">
            <Text className="mt-3">
              © {new Date().getFullYear()} Arsip Template. All Rights Reserved.
            </Text>
          </footer>
        </Section>
      </Body>
    </Tailwind>
  </Html>
);

WelcomeEmail.PreviewProps = {
  name: "Anon",
} as WelcomeEmailProps;

export default WelcomeEmail;
