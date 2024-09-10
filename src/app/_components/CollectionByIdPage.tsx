"use client";

import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import CardById from "~/components/Collection/CardById";
import CardList from "~/components/Collection/CardLists";
import Avatar from "~/components/ui/avatar";
import { badgeVariants } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CardProps } from "~/lib/interface";
import { cn, formatDateToHuman } from "~/lib/utils";
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
        <Card className="md:sticky md:top-[4.5rem]">
          <CardHeader>
            <CardTitle>{collection.name}</CardTitle>
            <CardDescription>{collection.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <CardDescription className="flex">
                <CalendarDays className="mr-2 h-4 w-4" />{" "}
                {formatDateToHuman(collection.createdAt ?? new Date())}
              </CardDescription>
              <CardDescription className="flex flex-wrap items-center space-x-2">
                <User className="mr-2 w-4" />
                {collection.createdBy.name}
              </CardDescription>
              <div className="flex items-center">
                <span className="mr-2 rounded-full border-2 border-secondary-foreground">
                  <Avatar
                    size={{
                      width: 30,
                      height: 30,
                    }}
                    seed={
                      collection.createdBy.avatarSeed ?? collection.createdBy.id
                    }
                  />
                </span>
                <Link
                  href={`/user/${collection?.createdBy.username}`}
                  className={cn(
                    badgeVariants({
                      variant: "ghost",
                      className: "py-1 font-bold",
                    }),
                  )}
                >
                  @
                  {collection?.createdBy.username ??
                    collection?.createdBy.id.slice(0, 15) ??
                    "Anon"}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
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
