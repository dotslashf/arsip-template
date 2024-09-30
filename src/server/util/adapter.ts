import { PrismaAdapter } from "@auth/prisma-adapter";
import { type PrismaClient } from "@prisma/client";
import { type Adapter } from "next-auth/adapters";
import resend from "./resend";
import WelcomeEmail from "~/app/_components/Email/Welcoming";

const PrismaAdapterExtend = (p: PrismaClient): Adapter => {
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
      return p.user.create({ data });
    },
  };
};

export default PrismaAdapterExtend;
