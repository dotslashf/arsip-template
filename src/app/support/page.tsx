import { type Metadata } from "next";
import Layout from "~/components/Layout";
import { HydrateClient } from "~/trpc/server";
import SupportPage from "../_components/SupportPage";

export const metadata: Metadata = {
  title: "Statistics",
  description: "Statistics arsip template",
};
export default function Statistics() {
  return (
    <HydrateClient>
      <Layout>
        <SupportPage />
      </Layout>
    </HydrateClient>
  );
}
