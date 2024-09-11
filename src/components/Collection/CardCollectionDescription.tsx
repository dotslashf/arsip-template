import { CalendarDays, ChevronRight, User } from "lucide-react";
import { formatDateToHuman, cn } from "~/lib/utils";
import Avatar from "../ui/avatar";
import { Badge, badgeVariants } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type CardCollectionDescriptionProps } from "~/lib/interface";
import Link from "next/link";

export default function CardCollectionDescription({
  createdAt,
  createdBy,
  description,
  name,
  isSingle,
  id,
  count,
}: CardCollectionDescriptionProps) {
  return (
    <Card
      className={cn("flex flex-col", isSingle && "md:sticky md:top-[4.5rem]")}
    >
      {isSingle ? (
        <CardHeader className="space-y-4">
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      ) : (
        <CardHeader className="space-y-4">
          <Link href={`/collection/${id}`}>
            <CardTitle className="flex hover:underline">
              {name} <ChevronRight className="ml-2 w-6" />
            </CardTitle>
          </Link>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      )}
      <CardContent className="mt-auto">
        <div className="flex flex-col space-y-2">
          <CardDescription className="flex">
            <CalendarDays className="mr-2 h-4 w-4" />{" "}
            {formatDateToHuman(createdAt ?? new Date())}
          </CardDescription>
          <div className="flex items-center">
            <span className="mr-2 rounded-full">
              <Avatar
                size={{
                  width: 40,
                  height: 40,
                }}
                seed={createdBy.avatarSeed ?? createdBy.id}
              />
            </span>
            <div className="flex w-full justify-between self-end">
              <Link
                href={`/user/${createdBy.username}`}
                className={cn(
                  badgeVariants({
                    variant: "ghost",
                    className: "py-1 font-bold",
                  }),
                )}
              >
                @{createdBy.username ?? createdBy.id.slice(0, 15) ?? "Anon"}
              </Link>
              {!isSingle && (
                <Badge variant={"secondary"} className="py-1">
                  {count} Template
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
