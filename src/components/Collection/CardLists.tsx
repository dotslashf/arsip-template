import { cn } from "~/utils";

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
            <div className="relative">
              <div
                className={cn(
                  "absolute left-[15px] w-0.5 bg-secondary-foreground",
                  index === 0 || index === listOfCollections.length - 1
                    ? "h-1/2"
                    : "h-full",
                  index === 0 && "bottom-0",
                  index === listOfCollections.length - 1 && "top-0",
                )}
              />
              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-secondary-foreground" />
                {renderCollection(collection, index)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
