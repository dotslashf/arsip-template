import { Circle } from "lucide-react";

interface CollectionListProps<T> {
  listOfCollections: T[];
  renderCollection: (collection: T, index: number) => React.ReactNode;
}

export default function CardList<T>({
  listOfCollections,
  renderCollection,
}: CollectionListProps<T>): JSX.Element {
  return (
    <>
      {listOfCollections.map((collection, index) => (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        <div key={(collection as any).id} className="flex w-full">
          <div className="relative mr-4 flex flex-col items-center">
            <div className="relative top-1/2 flex h-full justify-center">
              <Circle className="h-5 w-5 text-secondary-foreground" />
              {index < listOfCollections.length - 1 && (
                <div className="absolute top-[19px] h-full border-0 border-r border-foreground" />
              )}
            </div>
          </div>
          {renderCollection(collection, index)}
        </div>
      ))}
    </>
  );
}
