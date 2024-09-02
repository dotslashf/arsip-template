"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { DAYS } from "~/lib/constant";
import { api } from "~/trpc/react";

const chartConfig = {
  twitter: {
    label: "Twitter",
    color: "hsl(var(--twitter))",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(var(--facebook))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function StatisticsPage() {
  const [statistics] = api.copyPasta.statisticsBySource.useSuspenseQuery(
    {},
    {
      gcTime: 1 * DAYS,
    },
  );

  return (
    <div className="mx-auto w-full gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Bar chart berdasarkan sumber</CardTitle>
          <CardDescription>
            Jumlah template yang diarsipkan berdasarkan sumber 1 minggu lalu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={statistics}
              margin={{
                top: 20,
                right: 10,
                left: 10,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: any, _) => {
                  const newValue = value as string;
                  const date = newValue.split("-");
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                  return date[date.length - 1]!;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="twitter"
                fill="var(--color-twitter)"
                radius={4}
              ></Bar>
              <Bar
                dataKey="facebook"
                fill="var(--color-facebook)"
                radius={4}
              ></Bar>
              <Bar dataKey="other" fill="var(--color-other)" radius={4}></Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
