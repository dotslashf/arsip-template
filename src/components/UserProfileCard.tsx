import { type Session } from "next-auth";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Badge, badgeVariants } from "./ui/badge";
import { baseUrl, parseErrorMessages } from "~/lib/constant";
import { Edit, RotateCw, Share2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useCallback, useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import useToast from "./ui/use-react-hot-toast";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import ReactionSummaryProfile from "./ReactionSummaryProfile";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { v4 as uuidv4 } from "uuid";
import { editProfile } from "~/server/form/user";
import { Label } from "./ui/label";
import Avatar from "./ui/avatar";

interface UserProfileCardProps {
  session: Session | null;
  isPreviewMode: boolean;
}

export default function UserProfileCard({
  session,
  isPreviewMode,
}: UserProfileCardProps) {
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
  const editNameMutation = api.dashboard.editProfile.useMutation({
    onSuccess(data) {
      session!.user.name = data.name;
      session!.user.username = data.username;
      session!.user.avatarSeed = data.avatarSeed;
      setIsEditMode(!isEditMode);
      setAvatarPreviousState([]);
    },
  });

  const [avatarSeed, setAvatarSeed] = useState(
    session?.user.avatarSeed ?? session?.user.id ?? "Anon",
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarPreviousState, setAvatarPreviousState] = useState<string[]>([]);

  const form = useForm<z.infer<typeof editProfile>>({
    resolver: zodResolver(editProfile),
    defaultValues: {
      name: session?.user.name ?? "Anon",
      avatarSeed: session?.user.avatarSeed ?? session?.user.id ?? "Anon",
      username:
        session?.user.username ?? session?.user.id.slice(0, 15) ?? "Anon",
    },
  });

  const toast = useToast();

  function onSubmit(values: z.infer<typeof editProfile>) {
    if (
      session?.user.name === values.name &&
      session?.user.avatarSeed === avatarSeed &&
      session.user.username === values.username
    ) {
      setIsEditMode(!isEditMode);
      return;
    }
    toast({
      message: "",
      promiseFn: editNameMutation.mutateAsync({
        ...values,
        avatarSeed,
      }),
      type: "promise",
      promiseMsg: {
        success: "Profile telah diupdate 🫂",
        loading: "🔥 Sedang memasak",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        error: (err) => `${parseErrorMessages(err)}`,
      },
    });
  }

  const handleRandomAvatar = useCallback(() => {
    const uuid = uuidv4();
    setAvatarSeed(uuid);
    setAvatarPreviousState((prev) => {
      let state = [...prev, avatarSeed];
      if (state.length > 10) {
        state = state.slice(1, state.length);
      }
      return state;
    });
  }, [avatarSeed]);

  const handlePreviousAvatar = useCallback(() => {
    setAvatarPreviousState((prev) => {
      const newState = [...prev];
      const lastSeed = newState.pop();
      if (lastSeed) {
        setAvatarSeed(lastSeed);
      }
      return newState;
    });
  }, []);

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
            size={{
              width: 110,
              height: 110,
            }}
            seed={avatarSeed}
          />
        </span>
        <div className="w-full space-y-1 text-center">
          <div className="flex w-full items-center justify-center">
            {isEditMode ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col items-center space-y-2 pt-8"
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
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <Label htmlFor="username" className="sr-only">
                          Username
                        </Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                            @
                          </span>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="username"
                              className="pl-7"
                              aria-label="Enter username"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex w-full justify-between">
                    <Button variant={"green"} size={"icon"} type="submit">
                      <Edit className="w-4" />
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant={"default"}
                        size={"icon"}
                        onClick={handlePreviousAvatar}
                        type="button"
                        disabled={avatarPreviousState.length === 0}
                      >
                        <Undo2 className="w-4" />
                      </Button>
                      <Button
                        variant={"default"}
                        size={"icon"}
                        onClick={handleRandomAvatar}
                        type="button"
                      >
                        <RotateCw className="w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <span className="py-2 font-bold">
                  {session?.user.name ?? "Anon"}
                </span>
                <Badge variant={"ghost"} className="py-1 font-bold">
                  @
                  {session?.user.username ??
                    session?.user.id.slice(0, 15) ??
                    "Anon"}
                </Badge>
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
                  key={tag.count.id}
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
