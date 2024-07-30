import { type Session } from "next-auth";
import { Card, CardHeader, CardContent } from "./ui/card";
import Avatar from "boring-avatars";
import { Badge } from "./ui/badge";

interface UserProfileCardProps {
  session: Session | null;
}
export default function UserProfileCard({ session }: UserProfileCardProps) {
  return (
    <Card className="w-full max-w-sm bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col items-center space-y-2 p-6">
        <Avatar
          name={session?.user.id ?? "John Doe"}
          colors={["#0f172a", "#A6AEC1", "#CFD5E1", "#EDEDF2", "#FCFDFF"]}
          size={64}
          variant="beam"
        />
        <div className="space-y-1 text-center">
          <h4 className="text-lg font-semibold">
            {session?.user.name ?? "John Doe"}
          </h4>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center px-6 pb-6">
        <Badge>Role: {session?.user.role ?? "User"}</Badge>
      </CardContent>
    </Card>
  );
}
