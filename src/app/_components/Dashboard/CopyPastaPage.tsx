"use client";

import { type UserRole } from "@prisma/client";
import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/Common/BreadCrumbs";
import DashboardCopyPastaAdmin from "~/components/Dashboard/CopyPasta/DashboardCopyPastaAdmin";
import DashboardCopyPastaUser from "~/components/Dashboard/CopyPasta/DashboardCopyPastaUser";
import { useSession } from "~/components/Common/SessionContext";
import { getBreadcrumbs } from "~/utils";

export default function ProfileCopyPastaPage() {
  const session = useSession();
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  function dashboardByRole(role?: UserRole) {
    switch (role) {
      case "User":
        return <DashboardCopyPastaUser />;
      case "Admin":
        return <DashboardCopyPastaAdmin />;
      case "SuperAdmin":
        return <DashboardCopyPastaAdmin />;
      default:
        break;
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <BreadCrumbs path={breadcrumbs} />
      {dashboardByRole(session?.user.role)}
    </div>
  );
}
