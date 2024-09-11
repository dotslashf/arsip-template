"use client";

import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/BreadCrumbs";
import CardById from "~/components/Collection/CardById";
import CardCollectionDescription from "~/components/Collection/CardCollectionDescription";
import CardList from "~/components/Collection/CardLists";
import { CardCopyPastaMinimal, type CardProps } from "~/lib/interface";
import { getBreadcrumbs } from "~/lib/utils";
import { api } from "~/trpc/react";

interface CollectionByIdProps {
  id: string;
}
export default function CollectionByIdPage({ id }: CollectionByIdProps) {
  const [collection] = api.collection.byId.useSuspenseQuery({
    id,
  });

  const renderCollection = (copy: CardCopyPastaMinimal) => (
    <CardById copyPasta={copy} />
  );

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const currentPath = breadcrumbs.map((path, i) => {
    return {
      url: path.url,
      text: i === breadcrumbs.length - 1 ? collection.name : path.text,
    };
  });

  return (
    <div className="flex w-full flex-col">
      <BreadCrumbs path={currentPath} />
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/3">
          <CardCollectionDescription
            id={collection.id}
            isSingle={true}
            createdAt={collection.createdAt}
            description={collection.description}
            name={collection.name}
            createdBy={collection.createdBy}
            count={0}
          />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-2/3">
          <CardList
            listOfCollections={collection.copyPastas.map(
              (collection) => collection.copyPasta,
            )}
            renderCollection={renderCollection}
          />
        </div>
      </div>
    </div>
  );
}
