import { env } from "~/env";
import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const auth = new google.auth.GoogleAuth({
  keyFilename: env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: env.GCP_PROJECT_ID,
  scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
});

const client = new BetaAnalyticsDataClient({ auth });

export async function getPageViews() {
  const [response] = await client.runReport({
    property: `properties/451990252`,
    dateRanges: [
      {
        startDate: "14daysAgo",
        endDate: "yesterday",
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
    metrics: [
      {
        name: "screenPageViews",
      },
    ],
    orderBys: [
      {
        metric: {
          metricName: "screenPageViews",
        },
        desc: true,
      },
    ],
    limit: 5,
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "pagePath",
              stringFilter: {
                matchType: "PARTIAL_REGEXP",
                value: "/copy-pasta/.*",
              },
            },
          },
          {
            notExpression: {
              filter: {
                fieldName: "pagePath",
                inListFilter: {
                  values: ["/copy-pasta/create"],
                },
              },
            },
          },
        ],
      },
    },
  });

  if (!response.rows) {
    return [];
  }

  return response.rows.map((row) => {
    return {
      path: row.dimensionValues ? row.dimensionValues[0]?.value : 0,
      views: row.metricValues ? row.metricValues[0]?.value : 0,
    };
  });
}
