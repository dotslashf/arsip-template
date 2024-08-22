import { type Session } from "next-auth";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge, badgeVariants } from "./ui/badge";
import { avatarColorsTheme, baseUrl } from "~/lib/constant";
import { Edit, Share, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import useToast from "./ui/use-react-hot-toast";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import ReactionSummaryProfile from "./ReactionSummaryProfile";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";

interface UserProfileCardProps {
  session: Session | null;
  isPreviewMode: boolean;
}

export default function UserProfileCard({
  session,
  isPreviewMode,
}: UserProfileCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const editProfileName = z.object({
    name: z.string(),
  });
  const form = useForm<z.infer<typeof editProfileName>>({
    resolver: zodResolver(editProfileName),
    defaultValues: {
      name: session?.user.name ?? "Anon",
    },
  });
  const editNameMutation = api.dashboard.editName.useMutation();

  const toast = useToast();

  function onSubmit(values: z.infer<typeof editProfileName>) {
    if (session?.user.name === values.name) {
      setIsEditMode(!isEditMode);
      return;
    }
    toast({
      message: "",
      promiseFn: editNameMutation.mutateAsync({
        ...values,
      }),
      type: "promise",
      promiseMsg: {
        success: "Nama sudah diubah ya!",
        loading: "🔥 Sedang memasak",
        error: "Duh, gagal nih",
      },
    });
    session!.user.name = values.name;
    setIsEditMode(!isEditMode);
  }

  const { data: reactions } = api.reaction.getReactionsByUserId.useQuery(
    {
      userId: session!.user.id,
    },
    {
      staleTime: Infinity,
    },
  );

  const { data: topTags } = api.tag.getTopTagsByUserId.useQuery(
    {
      userId: session!.user.id,
    },
    {
      staleTime: Infinity,
    },
  );

  function handleShareProfile() {
    navigator.clipboard
      .writeText(`${baseUrl}/user/${session?.user.id}`)
      .then(() => {
        toast({
          message: "Silahkan dishare profilenya yah 🍰",
          type: "success",
        });
        sendGAEvent("event", "shareProfile", {
          value: `profile:${session?.user.name}`,
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <Card
      className={cn(
        "relative w-full bg-card text-card-foreground shadow-sm lg:w-1/4",
        isPreviewMode && "lg:w-full",
      )}
    >
      <CardHeader className="flex flex-col items-center space-y-2 p-6">
        <span className="rounded-full border-2 border-secondary-foreground">
          <Avatar
            name={session?.user.id ?? "John Doe"}
            colors={avatarColorsTheme}
            size={64}
            variant="beam"
          />
        </span>
        <div className="w-full space-y-1 text-center">
          <div className="flex w-full items-center justify-center">
            {isEditMode ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col items-center space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="nama?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant={"green"} size={"icon"} type="submit">
                    <Edit className="h-3 w-3" />
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <span className="py-2 font-bold">
                  {session?.user.name ?? "Anon"}
                </span>
                {!isPreviewMode && (
                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-2 font-mono text-sm font-semibold">
        <span className="flex w-full justify-between">
          Role: <Badge>{session?.user.role ?? "User"}</Badge>
        </span>
        <span className="flex w-full justify-between">
          Rank:
          <Badge>{session?.user.rank?.title ?? "User"}</Badge>
        </span>
        <span className="flex w-full justify-between">
          Login Provider:
          <Badge
            className={cn(
              session?.user.loginProvider
                ? `bg-${session.user.loginProvider} hover:bg-${session.user.loginProvider}-hover`
                : "bg-primary hover:bg-primary/80",
            )}
          >
            {session?.user.loginProvider ?? "User"}
          </Badge>
        </span>
      </CardContent>
      <Button
        onClick={handleShareProfile}
        className="absolute bottom-0 w-full rounded-t-none"
        variant={"destructive"}
      >
        Share <Share2 className="ml-2 w-4" />
      </Button>
      <CardFooter className="mb-8 flex flex-col space-y-2 font-mono text-sm font-semibold">
        <div className="flex flex-col items-center justify-center space-y-2">
          <span>Reactions:</span>
          <ReactionSummaryProfile reactions={reactions} />
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          <span>Tags:</span>
          <div className="grid grid-cols-2 gap-2">
            {topTags?.map((tag) => {
              return (
                <Link
                  className={cn(
                    badgeVariants({ variant: "outline" }),
                    "items-center justify-center",
                  )}
                  href={`/?tag=${tag.count.id}`}
                  key={tag.name}
                >
                  {tag.id} ({tag.count.count})
                </Link>
              );
            })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
