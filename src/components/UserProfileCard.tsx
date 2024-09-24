import { type Session } from "next-auth";
import { Card, CardHeader, CardFooter, CardTitle } from "./ui/card";
import { Badge, badgeVariants } from "./ui/badge";
import { ANALYTICS_EVENT, baseUrl, parseErrorMessages } from "~/lib/constant";
import { Edit, RotateCw, Save, Share2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useCallback, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import useToast from "./ui/use-react-hot-toast";
import { api } from "~/trpc/react";
import { cn } from "~/lib/utils";
import ReactionSummaryProfile from "./ReactionSummaryProfile";
import { v4 as uuidv4 } from "uuid";
import { editProfile } from "~/server/form/user";
import { Label } from "./ui/label";
import Avatar from "./ui/avatar";
import Tag from "./ui/tags";
import { type Tag as TagType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { trackEvent } from "~/lib/track";
import Link from "next/link";
import Lottie from "react-lottie-player";
import NumberTicker from "./magicui/number-ticker";
import { RainbowBadge } from "./magicui/rainbow-badge";

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
      enabled: !isPreviewMode,
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
  const { data: streak } = api.user.getStreakInfo.useQuery(
    { id: session?.user.id },
    {
      enabled: !!session,
    },
  );
  const editProfileMutation = api.dashboard.editProfile.useMutation({
    onSuccess(data) {
      session!.user.name = data.name;
      session!.user.username = data.username;
      session!.user.avatarSeed = data.avatarSeed;
      setIsEditMode(!isEditMode);
      setAvatarPreviousState([]);
      void trackEvent(ANALYTICS_EVENT.PROFILE_UPDATED, {
        name: data.name,
        username: data.username,
        avatar_seed: data.avatarSeed,
        user_id: data.id,
      });
    },
  });

  const [avatarSeed, setAvatarSeed] = useState(
    session?.user.avatarSeed ?? session?.user.id ?? "Anon",
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarPreviousState, setAvatarPreviousState] = useState<string[]>([]);
  const router = useRouter();

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
    void toast({
      message: "",
      promiseFn: editProfileMutation.mutateAsync({
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
      .writeText(
        `${baseUrl}/user/${session?.user.username ?? session?.user.id}?utm_content=profile`,
      )
      .then(() => {
        void toast({
          message: "Silahkan dishare profilenya yah 🍰",
          type: "success",
        });
        void trackEvent(ANALYTICS_EVENT.SHARE, {
          user_id: session?.user.id,
        });
      })
      .catch((err) => console.log(err));
  }

  const handleTagClick = (tag: TagType) => {
    void trackEvent(ANALYTICS_EVENT.BUTTON_CLICKED, {
      button: "tag_user_profile_card",
      value: `${tag.name}`,
    });
    return router.push(`/?tag=${tag.id}&utm_content=tag_user_profile`);
  };

  return (
    <Card
      className={cn(
        "relative w-full bg-card text-card-foreground shadow-sm",
        isPreviewMode && "lg:w-full",
      )}
    >
      <CardTitle className="absolute right-0 top-0 pr-3 pt-3">
        <Button variant={"default"} size={"icon"} onClick={handleShareProfile}>
          <Share2 className="w-4" />
        </Button>
      </CardTitle>
      <CardHeader className="flex flex-col items-center space-y-2 p-3">
        <span className="rounded-full border-2 border-secondary-foreground">
          <Avatar
            size={{
              width: 95,
              height: 95,
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
                  className="flex w-full flex-col items-center space-y-2 pt-4"
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
                    <Button variant={"confirm"} type="submit">
                      Simpan
                      <Save className="ml-2 w-4" />
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
              <div className="flex flex-col items-center gap-4">
                <span className="font-bold">
                  {session?.user.name ?? "Anon"}
                </span>
                <Link
                  href={`/user/${session?.user.username}`}
                  className={cn(
                    badgeVariants({
                      variant: "default",
                      className: "py1 font-bold",
                    }),
                  )}
                >
                  @
                  {session?.user.username ??
                    session?.user.id.slice(0, 15) ??
                    "Anon"}
                </Link>
                <div className="flex gap-4">
                  <Badge variant={"white"}>
                    Rank: {session?.user.rank?.title ?? "User"}
                  </Badge>
                  <Badge
                    className={cn(
                      session?.user.loginProvider
                        ? `bg-${session.user.loginProvider} hover:bg-${session.user.loginProvider}-hover`
                        : "bg-primary hover:bg-primary/80",
                    )}
                  >
                    Login: {session?.user.loginProvider ?? "User"}
                  </Badge>
                  {streak?.currentStreak > 0 && (
                    <RainbowBadge>
                      <Lottie
                        path="https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/lottie.json"
                        play
                        loop
                        className="mr-2 h-4 w-4"
                      />
                      <NumberTicker
                        value={streak?.currentStreak ?? 0}
                        className="mr-2"
                      />
                      streak
                    </RainbowBadge>
                  )}
                </div>
                {!isPreviewMode && (
                  <Button
                    variant={"warning"}
                    size={"sm"}
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <span className="text-sm">Edit Profile</span>
                    <Edit className="ml-2 h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      {!isPreviewMode || (topTags && topTags.length > 0) ? (
        <CardFooter className="flex flex-col space-y-2 text-sm font-semibold">
          {!isPreviewMode && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <span>Reactions:</span>
              <ReactionSummaryProfile reactions={reactions} />
            </div>
          )}
          {topTags && topTags.length > 0 && (
            <div className="flex flex-col items-center justify-center space-y-2">
              <span>Tags:</span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {topTags?.map((tag) => {
                  const now = new Date();
                  const formattedTag = {
                    createdAt: now,
                    id: tag.count.id,
                    name: `${tag.id} (${tag.count.count})`,
                    updatedAt: now,
                  };
                  return (
                    <Tag
                      key={tag.count.id}
                      tagContent={formattedTag}
                      onClick={() => handleTagClick(formattedTag)}
                      className="rounded-sm shadow-sm hover:bg-primary hover:text-primary-foreground"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
}
