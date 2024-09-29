import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface StreakPageProps {
  previewText: string;
  name: string;
  streakCount: number;
}
export const StreakPage = ({
  previewText,
  name,
  streakCount,
}: StreakPageProps) => {
  return (
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
                Jangan sampai streakmu hilang!
                <br />
                Saat ini kamu memiliki{" "}
                <span className="font-semibold">{streakCount}</span>.
              </Text>

              <Text className="mt-2 leading-loose">Tambahin template yuk!</Text>

              <Button
                href="https://arsiptemplate.app/copy-pasta/create"
                className="mt-2 inline-flex items-center justify-center rounded-md bg-[#4D7CDB] px-6 py-3 text-base font-semibold text-white"
              >
                Mulai Mengarsipkan
              </Button>
            </main>

            <footer className="mt-8">
              <Text className="mt-3">
                © {new Date().getFullYear()} Arsip Template. All Rights
                Reserved.
              </Text>
            </footer>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

StreakPage.PreviewProps = {
  name: "Fadhlu",
  previewText: "Streakmu bisa saja hilang!",
  streakCount: 4,
} as StreakPageProps;

export default StreakPage;
