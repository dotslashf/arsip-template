import { type Metadata } from "next";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import HOCAuth from "~/components/HOCAuth";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata: Metadata = {
  title: "Statistics",
  description: "Statistics arsip template",
};
export default function Statistics() {
  return (
    <HydrateClient>
      <Layout>
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Support Me On
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="max-w-md space-y-4 text-center">
              <p className="font-bold">Halo 👋,</p>
              <p>Terima kasih sudah menjadi bagian dari plaatform ini!</p>
              <p>
                Saya sangat menghargai setiap kunjungan, komen, dan dukungan
                yang kalian berikan. Platform ini saya buat dengan penuh
                dedikasi untuk `&quot;`mengarsipkan`&quot;` konten template yang
                bermanfaat dan menghibur bagi kalian semua.
              </p>
              <p>
                Jika kalian merasa senang atau terbantu dengan platform ini,
                adapun cara sederhana untuk menunjukkan dukungan kalian. Kalian
                bisa membantu saya untuk membayar biaya server dan pemeliharaan
                platform ini dengan memindai QR code di bawah. Setiap
                kontribusi, sekecil apapun, sangat berarti dan membantu saya
                untuk terus menjalankan platform ini.
              </p>
              <p>
                Dukungan kalian tidak hanya membantu menjaga platform ini tetap
                berjalan, tetapi juga memberi saya semangat untuk terus berkarya
                dan mengembangkan lebih banyak fitur yang menarik.
              </p>
            </div>
            <div className="relative h-64 w-64">
              <Image
                src={"/qr.png"}
                alt="qr code"
                width={250}
                height={250}
                className="rounded-md bg-white"
              />
            </div>
          </CardContent>
        </Card>
      </Layout>
    </HydrateClient>
  );
}
