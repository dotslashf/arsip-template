"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import BreadCrumbs from "~/components/BreadCrumbs";

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
import { formatDateToHuman, getBreadcrumbs } from "~/lib/utils";
import { api } from "~/trpc/react";

const chartConfigDonutReaction = {
  reaction: {
    label: "Reactions",
  },
  Kocak: {
    label: "Kocak 🤣",
    color: "hsl(var(--chart-1))",
  },
  Marah: {
    label: "Marah 🤬",
    color: "hsl(var(--chart-2))",
  },
  Setuju: {
    label: "Duar 🤯",
    color: "hsl(var(--chart-3))",
  },
  Hah: {
    label: "Setuju 💯",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const chartConfigBarChartCopyPastaByDay = {
  views: {
    label: "Jumlah Template:",
  },
  copyPasta: {
    label: "Template",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function StatisticsPage() {
  const [reactions] =
    api.statistics.getReactionCategoryByEmotions.useSuspenseQuery(undefined, {
      gcTime: 1 * DAYS,
    });

  const [tagCoOccurrence] = api.statistics.getTagCoOccurrence.useSuspenseQuery(
    undefined,
    {
      gcTime: 1 * DAYS,
    },
  );

  const [copyPastas] =
    api.statistics.getCopyPastaSubmittedPerDay.useSuspenseQuery(
      {},
      {
        gcTime: 1 * DAYS,
      },
    );

  const chartDataBarChartCopyPastasByDay = copyPastas.map((c) => {
    return {
      date: formatDateToHuman(c.submission_date, "yyyy-MM-dd"),
      copyPasta: c.submission_count,
    };
  });

  const chartDataReactionDonuts = reactions.map((r) => {
    return {
      reaction: r.emotion,
      count: r.count,
      fill: `var(--color-${r.emotion}`,
    };
  });

  const totalCountChartReactionDonut = useMemo(() => {
    return chartDataReactionDonuts.reduce((acc, curr) => acc + curr.count, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartDataTagCoOccurrenceBar = tagCoOccurrence.map((tag) => {
    const key = `${tag.tag1}_${tag.tag2}`;
    return {
      key,
      tag: key,
      count: tag.co_occurrence_count,
      fill: `var(--color-${key})`,
    };
  });

  const chartConfigTagCoOccurrenceBar = tagCoOccurrence.reduce(
    (acc, tag, index) => {
      const key = `${tag.tag1}_${tag.tag2}`;
      acc[key] = {
        label: `${tag.tag1} - ${tag.tag2}`,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    },
    {} as Record<string, any>,
  );
  const chartConfigTagCoOccurrenceBarFinal = {
    ...chartConfigTagCoOccurrenceBar,
    count: {
      label: "Jumlah",
    },
  };

  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div className="mx-auto w-full gap-4">
      <BreadCrumbs path={breadcrumbs} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Template Perhari</CardTitle>
            <CardDescription>
              Jumlah template yang dibuat perhari (30 hari kebelakang)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfigBarChartCopyPastaByDay}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartDataBarChartCopyPastasByDay}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value: string) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[200px]"
                      nameKey="views"
                      labelFormatter={(value: string) => {
                        return new Date(value).toLocaleDateString("id-ID", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar dataKey={"copyPasta"} fill={`var(--color-copyPasta)`} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donut Pie Total Reaction</CardTitle>
            <CardDescription>Jumlah reaction saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfigDonutReaction}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartDataReactionDonuts}
                  dataKey="count"
                  nameKey="reaction"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalCountChartReactionDonut}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Reaction
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Korelasi Antar 2 Tag</CardTitle>
            <CardDescription>
              Template dengan 2 tag yang saling berkaitan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigTagCoOccurrenceBarFinal}>
              <BarChart
                accessibilityLayer
                data={chartDataTagCoOccurrenceBar}
                layout="vertical"
                margin={{
                  left: 50,
                }}
              >
                <YAxis
                  dataKey="tag"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    chartConfigTagCoOccurrenceBarFinal[
                      value as keyof typeof chartConfigTagCoOccurrenceBarFinal
                    ]?.label
                  }
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" layout="vertical" radius={5} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
