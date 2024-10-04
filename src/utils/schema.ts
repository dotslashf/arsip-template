import {
  type Thing,
  type WithContext,
  type WebSite,
  type SearchAction,
} from "schema-dts";
import { baseUrl } from "../lib/constant";

export function generateSchemaById<T extends Thing>(json: WithContext<T>) {
  return json;
}

type QueryAction = SearchAction & {
  "query-input": string;
};

export function generateSchemaOrgWebSite(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arsip Template",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/copy-pasta?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    } as QueryAction,
  };
}
