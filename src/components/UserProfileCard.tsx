import { type Session } from "next-auth";
import { Card, CardHeader, CardContent } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge } from "./ui/badge";
import { avatarColorsTheme } from "~/lib/constant";

interface UserProfileCardProps {
  session: Session | null;
}
export default function UserProfileCard({ session }: UserProfileCardProps) {
  return (
    <Card className="w-full bg-card text-card-foreground shadow-sm lg:w-1/4">
      <CardHeader className="flex flex-col items-center space-y-2 p-6">
        <Avatar
          name={session?.user.id ?? "John Doe"}
          colors={avatarColorsTheme}
          size={64}
          variant="beam"
        />
        <div className="space-y-1 text-center">
          <h4 className="text-lg font-semibold">
            {session?.user.name ?? "John Doe"}
          </h4>
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
      </CardContent>
    </Card>
  );
}
