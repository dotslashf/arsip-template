import Layout from "~/components/Common/Layout";
import { HydrateClient } from "~/trpc/server";

const changelogData = [
  {
    date: "11 Agustus 2024",
    changes: [
      "Menambahkan halaman ini",
      "Nambahin fitur feedback dan peringkat user",
      "Bikin sistem ranking yang lebih canggih",
      "Update tema dan bikin animasi jadi lebih smooth",
    ],
  },
  {
    date: "10 Agustus 2024",
    changes: [
      "Nambah papan peringkat buat liat siapa yang paling sering ngearsip",
      "Bikin halaman Terms of Service sama Privacy Policy (biar legal dikit)",
      "Mulai masukin tracking yang lebih bagus",
      "Ningkatin cara deteksi sumber pake URL",
    ],
  },
  {
    date: "9 Agustus 2024",
    changes: [
      "Ubah database biar kolom pembuat bisa dikosongkan",
      "Bikin endpoint baru buat ambil data edit-editan",
    ],
  },
  {
    date: "8 Agustus 2024",
    changes: [
      "Bikin fitur search jadi lebih canggih",
      "Pasang Open Graph biar kalo di-share di medsos jadi keren",
    ],
  },
  {
    date: "7 Agustus 2024",
    changes: [
      "Dandanin dashboard biar lebih oke",
      "Benerin sistem tag",
      "Bikin halaman error yang gak bikin user bingung",
    ],
  },
  {
    date: "5 Agustus 2024",
    changes: [
      "Bikin generator gambar Open Graph otomatis",
      "Ganti tampilan dan warna platform biar makin cakep",
      'Nambahin fitur edit buat konten "copy pasta"',
    ],
  },
  {
    date: "1 Agustus 2024",
    changes: [
      "Luncurin sistem tema baru yang bisa diganti-ganti",
      "Bikin fitur jelajah konten pake tag",
      "Nambahin sistem approval konten biar gak sembarangan",
      "Upgrade integrasi sama Google Analytics",
    ],
  },
  {
    date: "22 - 31 Juli 2024",
    changes: [
      `Bangun fitur-fitur dasar platform:
      - Membuat konten template (copy-pasta) setelah login
      - Sistem role buat ngatur akses
      - Fitur pencarian yang lebih canggih
      - Sistem login menggunakan twitter`,
      "Nyiapin struktur database dan kerangka aplikasi",
    ],
  },
];

export default function ChangeLog() {
  return (
    <HydrateClient>
      <Layout>
        <div className="mx-auto h-full w-full">
          <h1 className="mb-8 text-2xl font-bold md:text-4xl">Changelog</h1>
          <div className="space-y-6 text-justify">
            <p className="text-muted-foreground">
              Terakhir diperbarui: {changelogData[0]?.date}
            </p>
            {changelogData.map((data, index) => (
              <div key={index} className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">{data.date}</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {data.changes.map((item, itemIndeks) => (
                    <li
                      key={itemIndeks}
                      className="whitespace-pre-line text-sm text-gray-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </HydrateClient>
  );
}
