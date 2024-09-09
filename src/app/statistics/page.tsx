import { type Metadata } from "next";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import { StatisticsPage } from "../_components/StatisticsPage";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Statistics",
  description: "Statistics arsip template",
};
export default function Statistics() {
  return (
    <HydrateClient>
      <Layout>
        <Suspense
          fallback={
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              <Skeleton className="h-80 w-full" />
              <Skeleton className="h-80 w-full" />
            </div>
          }
        >
          <StatisticsPage />
        </Suspense>
      </Layout>
    </HydrateClient>
  );
}
