import { type Metadata } from "next";
import Link from "next/link";
import Brand from "~/components/Brand";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Ketentuan Layanan",
  description: "Ketentuan Layanan arsip-template",
};
export default function TOSPage() {
  return (
    <HydrateClient>
      <Layout>
        <Brand />
        <div className="mx-auto">
          <h1 className="mb-8 text-2xl font-bold md:text-4xl">
            Ketentuan Layanan
          </h1>
          <div className="space-y-6 text-justify">
            <p className="text-muted-foreground">
              Terakhir diperbarui: 10 Agustus 2024
            </p>
            <p>
              Selamat datang di{" "}
              <span className="font-bold">arsip-template.</span> Dengan
              mengakses atau menggunakan layanan kami, Anda setuju untuk terikat
              dengan syarat dan ketentuan yang berlaku.
            </p>
            <p>
              Anda setuju untuk menggunakan arsip-template sesuai dengan hukum
              dan peraturan yang berlaku di Indonesia. Anda dilarang menggunakan
              layanan kami untuk aktivitas yang melanggar hukum, menipu, atau
              merugikan pihak lain. Konten yang disimpan di arsip-template
              adalah tanggung jawab Anda sebagai pengguna. Kami tidak
              bertanggung jawab atas keakuratan atau legalitas konten tersebut.
              Kami juga berhak untuk menghapus konten yang dianggap melanggar
              hukum atau melanggar ketentuan ini tanpa pemberitahuan sebelumnya.
            </p>
            <p>
              Kami berhak untuk mengubah atau menghentikan layanan
              arsip-template kapan saja tanpa pemberitahuan sebelumnya. Kami
              juga tidak bertanggung jawab atas kerugian langsung, tidak
              langsung, insidental, khusus, atau konsekuensial yang timbul dari
              penggunaan atau ketidakmampuan untuk menggunakan layanan kami.
            </p>
            <p>
              Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke
              waktu. Perubahan akan berlaku setelah dipublikasikan di situs
              kami, dan Anda bertanggung jawab untuk meninjau ketentuan ini
              secara berkala.
            </p>
            <p>
              Jika Anda memiliki pertanyaan tentang Ketentuan Layanan ini,
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
