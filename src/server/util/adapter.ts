import { type PrismaClient } from "@prisma/client";
import resend from "./resend";
import WelcomeEmail from "~/app/_components/Email/Welcoming";
import { PrismaAdapter } from "@auth/prisma-adapter";

const PrismaAdapterExtend = (p: PrismaClient) => {
  return {
    ...PrismaAdapter(p),
    createUser: async ({ ...data }) => {
      await resend.emails.send({
        from: "Arsip Template <noreply@arsiptemplate.app>",
        to: data.email,
        subject: "Selamat datang di arsip template!",
        react: WelcomeEmail({
          name: data.name ?? data.email,
          previewText: "Selamat datang di arsip template!",
        }),
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return p.user.create({ data }) as any;
    },
  };
};

export default PrismaAdapterExtend;
