import { type Metadata } from "next";
import Link from "next/link";
import Brand from "~/components/Brand";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan Privasi arsip-template",
};
export default function PrivacyPolicyPage() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <div className="mx-auto">
          <h1 className="mb-8 text-2xl font-bold md:text-4xl">
            Kebijakan Privasi
          </h1>
          <div className="space-y-6 text-justify">
            <p className="text-muted-foreground">
              Terakhir diperbarui: 10 Agustus 2024
            </p>
            <p>
              <span className="font-bold">arsip-template</span> menghargai
              privasi Anda dan berkomitmen untuk melindungi informasi pribadi
              Anda. Kebijakan Privasi ini menjelaskan bagaimana kami
              mengumpulkan, menggunakan, dan melindungi informasi Anda.
            </p>
            <p>
              Kami dapat mengumpulkan informasi pribadi seperti nama, alamat
              email, dan data lain yang Anda berikan secara sukarela saat
              menggunakan layanan kami. Selain itu, kami juga dapat mengumpulkan
              informasi non-pribadi seperti data penggunaan situs dan preferensi
              pengguna. Informasi yang kami kumpulkan digunakan untuk
              mengoperasikan, memelihara, dan meningkatkan layanan kami.
            </p>
            <p>
              Kami tidak akan membagikan informasi pribadi Anda kepada pihak
              ketiga tanpa persetujuan Anda, kecuali jika diwajibkan oleh hukum.
              Kami juga mengambil langkah-langkah keamanan yang wajar untuk
              melindungi informasi Anda dari akses yang tidak sah, penggunaan,
              atau pengungkapan.
            </p>
            <p>
              Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu.
              Perubahan akan berlaku setelah dipublikasikan di situs kami. Anda
              bertanggung jawab untuk meninjau kebijakan ini secara berkala.
            </p>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
              silakan hubungi kami melalui{" "}
              <Link
                className="text-blue-400 underline"
                href={`https://x.com/ichikiwhere`}
              >
                twitter
              </Link>
              .
            </p>
          </div>
        </div>
      </Layout>
    </HydrateClient>
  );
}
