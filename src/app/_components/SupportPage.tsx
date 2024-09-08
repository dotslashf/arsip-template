import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export default function SupportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Support Me
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="max-w-md space-y-4 text-center">
          <p>Halo 👋</p>
          <p>Terima kasih sudah menjadi bagian dari platform ini!</p>
          <p>
            Gue sangat menghargai setiap kunjungan, komen, dan dukungan yang
            kalian berikan. Platform ini gue buat dengan penuh dedikasi untuk
            &quot;mengarsipkan&quot; konten template (copy-pasta) netizen yang
            bisa menghibur bagi kalian semua.
          </p>
          <p>
            Kalau kalian merasa terbantu atau senang dengan platform ini, ada
            cara simpel buat nunjukin dukungan kalian. Kalian bisa bantu gue
            buat bayar biaya server dan maintenance dengan memindai QR code di
            bawah atau klik{" "}
            <Link
              href="https://saweria.co/dotslashf"
              className="text-primary underline"
              target="__blank"
            >
              disini
            </Link>
            . Setiap kontribusi, sekecil apapun, sangat berarti dan membantu gue
            untuk terus menjalankan platform ini.
          </p>
          <p>
            Dukungan kalian nggak cuma bantu platform ini tetap jalan, tapi juga
            kasih gue semangat buat terus berkarya dan mengembangkan fitur-fitur
            seru lainnya.
          </p>
          <p>Terima kasih banyak! 👋</p>
        </div>
        <div className="relative h-64 w-64 rounded-md bg-white p-4">
          <Image src={"/qr.png"} alt="qr code" width={250} height={250} />
        </div>
        <div>
          <Link
            href={"https://saweria.co/dotslashf"}
            className={cn(buttonVariants({}))}
            target="__blank"
          >
            Saweria <ArrowRight className="ml-2 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
