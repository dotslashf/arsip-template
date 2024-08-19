import { type Session } from "next-auth";
import { Card, CardHeader, CardContent } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge } from "./ui/badge";
import { avatarColorsTheme } from "~/lib/constant";
import { Edit } from "lucide-react";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import useToast from "./ui/use-react-hot-toast";
import { api } from "~/trpc/react";

interface UserProfileCardProps {
  session: Session | null;
}

export default function UserProfileCard({ session }: UserProfileCardProps) {
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

  return (
    <Card className="w-full bg-card text-card-foreground shadow-sm lg:w-1/4">
      <CardHeader className="flex flex-col items-center space-y-2 p-6">
        <Avatar
          name={session?.user.id ?? "John Doe"}
          colors={avatarColorsTheme}
          size={64}
          variant="beam"
        />
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
                <span className="py-2">{session?.user.name ?? "Anon"}</span>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
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
            className={`bg-${session?.user.loginProvider ?? "primary"} hover:bg-twitter-hover`}
          >
            {session?.user.loginProvider ?? "User"}
          </Badge>
        </span>
      </CardContent>
    </Card>
  );
}
