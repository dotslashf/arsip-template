import { CalendarDays, Check, ChevronRight, Pencil, Trash } from "lucide-react";
import { formatDateToHuman, cn } from "~/lib/utils";
import Avatar from "../ui/avatar";
import { Badge, badgeVariants } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type CardCollectionDescriptionProps } from "~/lib/interface";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import useToast from "../ui/use-react-hot-toast";
import { api } from "~/trpc/react";

export default function CardCollectionDescription({
  createdAt,
  createdBy,
  description,
  name,
  isSingle,
  id,
  count,
  isEditable = false,
}: CardCollectionDescriptionProps) {
  const utils = api.useUtils();
  const toast = useToast();

  const [isSureDelete, setIsSureDelete] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);

  const deleteMutation = api.collection.delete.useMutation({
    async onSuccess() {
      void utils.collection.byUserId.invalidate();
      void utils.collection.list.invalidate();
    },
  });

  async function handleDelete() {
    void toast({
      message: "",
      type: "promise",
      promiseFn: deleteMutation.mutateAsync({
        id,
      }),
      promiseMsg: {
        success: "Template sudah dihapus! 🗑️",
        loading: "🔥 Sedang memasak",
        error: "Duh, gagal nih",
      },
    });
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        deleteButtonRef.current &&
        !deleteButtonRef.current.contains(event.target as Node)
      ) {
        setIsSureDelete(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [deleteButtonRef]);

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
      {isEditable && (
        <CardFooter className="flex justify-between">
          <Link
            className={cn(buttonVariants({ variant: "warning", size: "sm" }))}
            href={`/dashboard/collection/${id}/edit`}
          >
            Edit
            <Pencil className="ml-2 w-4" />
          </Link>
          {isSureDelete ? (
            <Button
              ref={deleteButtonRef}
              variant={"destructive"}
              onClick={handleDelete}
              size={"sm"}
            >
              Yakin
              <Check className="ml-2 w-4" />
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              onClick={() => setIsSureDelete(true)}
              size={"sm"}
            >
              Hapus
              <Trash className="ml-2 w-4" />
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
