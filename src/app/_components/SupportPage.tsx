import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function SupportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Support Me
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
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
            bawah. Setiap kontribusi, sekecil apapun, sangat berarti dan
            membantu gue untuk terus menjalankan platform ini.
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
      </CardContent>
    </Card>
  );
}
