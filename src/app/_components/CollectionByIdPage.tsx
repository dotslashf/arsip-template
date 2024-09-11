"use client";

import CardById from "~/components/Collection/CardById";
import CardCollectionDescription from "~/components/Collection/CardCollectionDescription";
import CardList from "~/components/Collection/CardLists";
import { type CardProps } from "~/lib/interface";
import { api } from "~/trpc/react";

interface CollectionByIdProps {
  id: string;
}
export default function CollectionByIdPage({ id }: CollectionByIdProps) {
  const [collection] = api.collection.byId.useSuspenseQuery({
    id,
  });

  const renderCollection = (copy: CardProps) => (
    <CardById copyPasta={copy.copyPasta} />
  );

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row">
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
          listOfCollections={collection.copyPastas}
          renderCollection={renderCollection}
        />
      </div>
    </div>
  );
}
