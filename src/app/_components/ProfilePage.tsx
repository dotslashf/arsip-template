"use client";

import { type UserRole } from "@prisma/client";
import DashboardProfileRoleAdmin from "~/components/DashboardProfileRoleAdmin";
import DashboardProfileRoleUser from "~/components/DashboardProfileRoleUser";
import { useSession } from "~/components/SessionContext";
import UserProfileCard from "~/components/UserProfileCard";

export default function ProfilePage() {
  const session = useSession();

  function dashboardByRole(role?: UserRole) {
    switch (role) {
      case "User":
        return <DashboardProfileRoleUser />;
      case "Admin":
        return <DashboardProfileRoleAdmin />;
      default:
        break;
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 lg:flex-row">
      <UserProfileCard session={session} isPreviewMode={false} />
      {dashboardByRole(session?.user.role)}
    </div>
  );
}
