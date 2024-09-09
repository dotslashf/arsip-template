import { type Metadata } from "next";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import SupportPage from "../_components/SupportPage";

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
