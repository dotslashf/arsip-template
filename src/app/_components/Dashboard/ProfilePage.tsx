"use client";

import { ArrowRight, Library, NotebookPen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BreadCrumbs from "~/components/BreadCrumbs";
import { useSession } from "~/components/SessionContext";
import { buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import UserProfileCard from "~/components/UserProfileCard";
import { cn, getBreadcrumbs } from "~/lib/utils";

export default function ProfilePage() {
  const session = useSession();

  const menus = [
    {
      path: "/dashboard/copy-pasta",
      label: "Template",
      icon: <NotebookPen className="ml-2 w-4" />,
    },
    {
      path: "/dashboard/collection",
      label: "Koleksi",
      icon: <Library className="ml-2 w-4" />,
    },
  ];

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <BreadCrumbs path={breadcrumbs} />
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <div className="w-full md:w-1/2">
          <UserProfileCard session={session} isPreviewMode={false} />
        </div>
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          {menus.map((menu, i) => {
            return (
              <Card key={i} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    {menu.label}
                    {menu.icon}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`${menu.path}`}
                    className={cn(
                      buttonVariants({ variant: "link", size: "url" }),
                      "w-full",
                    )}
                  >
                    Lebih Lanjut <ArrowRight className="ml-auto h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
