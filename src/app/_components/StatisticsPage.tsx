"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

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
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function StatisticsPage() {
  const [statistics] = api.copyPasta.statisticsBySource.useSuspenseQuery(
    undefined,
    {
      gcTime: 1 * DAYS,
    },
  );
  const [statisticsDonut] = api.copyPasta.count.useSuspenseQuery(undefined, {
    staleTime: 1 * DAYS,
    gcTime: 1 * DAYS,
  });

  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Bar chart berdasarkan sumber</CardTitle>
          <CardDescription>
            Jumlah template yang diarsipkan berdasarkan sumber 2 minggu lalu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={statistics}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar dataKey="twitter" fill="var(--color-twitter)" radius={4} />
              <Bar dataKey="facebook" fill="var(--color-facebook)" radius={4} />
              <Bar dataKey="other" fill="var(--color-other)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Keseluruhan berdasarkan sumber</CardTitle>
          <CardDescription>Total {statisticsDonut.total}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={statisticsDonut.sources}
                dataKey="count"
                label
                nameKey="source"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}