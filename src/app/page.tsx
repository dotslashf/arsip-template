// import Link from "next/link";

// import { getServerAuthSession } from "~/server/auth";
import CopyPastaCard, { CopyPastaCardWithTagsProps } from "~/components/CopyPastaCard";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const copyPastas: CopyPastaCardWithTagsProps[] = [
    {
      content: "tai banget liat orang orang sekarang jahat banget. jerome dibully, arhan dibully, timnas dibully. kaya apa banget lu semua? anjinglah kesel liat twitter banyak orang goblok juga dimana mana",
      createdAt: new Date(),
      tags: [
        { name: "Meme" },
        { name: "Lucu" }
      ],
      source: "Twitter",
      id: "8cd5bf29-df48-485a-b69c-5050894d1fa3",
      createdById: "886fbc7c-4091-477c-adc1-343cea333a3d",
      updatedAt: new Date()
    },
    {
      content: `Tentang Logo NU yg diubah-ubah itu menurut saya tidak layak, tidak setuju dengan sikap politik NU dan mengkritik nya itu sah, tapi mengedit dgn buruk akan menyinggung banyak orang, termasuk Nahdliyyin yang non-Israel ataupun kontra Israel. Selain itu, mengedit lambang yang merupakan simbol "sakral" dalam organisasi, juga sebenarnya tidak memberikan bobot kritik apapun. Akhirnya sekarang kan malah muncul ribut horizontal di tema lain.

Dan jangan pula bawa omongan "Tuhan tidak perlu dibela" dengan menggeneralisir seluruh Nahdliyyin Walaupun memang adagium yang layak dikritik, lalu membandingkan nya dgn hinaan terhadap Agama dan Nabi, faktanya masih banyak juga Nahdliyyin yang geram melihat istihza'.
 Intinya kritik, tidak setuju dan tidak suka terhadap sikap PBNU sah, wajar, bahkan layak. Tapi baiknya hindari hal-hal yang menyinggung banyak orang dan mengaburkan isu utama.

And I'm saying this not because my position as A'wan Syuriah in PCI 😑`,
      createdAt: new Date(),
      tags: [
        { name: "Meme" },
        { name: "Lucu" }
      ],
      source: "Twitter",
      id: "8cd5bf29-df48-485a-b69c-5050894d1fa3",
      createdById: "886fbc7c-4091-477c-adc1-343cea333a3d",
      updatedAt: new Date()
    },
    {
      content: `cowok umur over 25 emang bawaannya bitter karena mereka udah expired & hit the wall. 

cowok jg malas dekatin mereka karena banyak tuntutan, emotional baggage & trauma.

alhasil hanya bisa shaming laki2 di sosmed untuk menutup ketidak lakuan mereka. 🤣`,
      createdAt: new Date(),
      tags: [
        { name: "Meme" },
        { name: "Lucu" }
      ],
      source: "Twitter",
      id: "8cd5bf29-df48-485a-b69c-5050894d1fa3",
      createdById: "886fbc7c-4091-477c-adc1-343cea333a3d",
      updatedAt: new Date()
    },
    {
      content: `cowok umur over 25 emang bawaannya bitter karena mereka udah expired & hit the wall. 

cowok jg malas dekatin mereka karena banyak tuntutan, emotional baggage & trauma.

alhasil hanya bisa shaming laki2 di sosmed untuk menutup ketidak lakuan mereka. 🤣`,
      createdAt: new Date(),
      tags: [
        { name: "Meme" },
        { name: "Lucu" }
      ],
      source: "Twitter",
      id: "8cd5bf29-df48-485a-b69c-5050894d1fa3",
      createdById: "886fbc7c-4091-477c-adc1-343cea333a3d",
      updatedAt: new Date()
    }

  ]

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center text-primary">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-2xl font-bold">ini<br />template<br />bukan</h1>
          <div className="grid grid-cols-2 gap-4">
            {copyPastas.map((copy, i) =>
              (<CopyPastaCard key={i} content={copy.content} createdAt={copy.createdAt} tags={copy.tags} id={copy.id} createdById={""} source={copy.source} updatedAt={copy.updatedAt} />)
            )}
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
