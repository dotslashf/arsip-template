import { type Metadata } from "next";
import Layout from "~/components/Common/Layout";
import { HydrateClient } from "~/trpc/server";
import SupportPage from "~/app/_components/SupportPage";

export const metadata: Metadata = {
  title: "Support this platform",
  description: "Support this platform",
};
export default function Support() {
  return (
    <HydrateClient>
      <Layout>
        <SupportPage />
      </Layout>
    </HydrateClient>
  );
}
