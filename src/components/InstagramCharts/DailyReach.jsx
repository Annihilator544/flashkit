"use client";

import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useInstagramData } from "store/use-instagram-data";

const chartConfig = {
  reach: {
    label: "Reach",
    color: "hsl(var(--instagram-chart-1))",
  },
};
function formatDate(date) {
  const options = {
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options).replace(",", "");
}
//conver 2025-01-12 to 12 jan
function convertDateFormat(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}
const DailyReach = () => {
  // Prepare data for the chart
  const { instagramData, instagramCalculatedData } = useInstagramData();
  const reachData = instagramData.daily;
  const percentageChangeReach = instagramCalculatedData.percentageChangeReach;
  const chartData = Object.keys(reachData).slice(-7).map((date) => ({
    date: convertDateFormat(date), // X-axis value
    reach: reachData[date].reach, // Y-axis value
  }));

  const date = new Date();
  const formatedDate = formatDate(date);
  const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
  const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    chartData.length ?<Card className=" flex flex-col flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Reach</CardTitle>
        <CardDescription>
        {formatedDateWeekAgo} to {formatedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <defs>
              <linearGradient id="fillReach" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-reach)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-reach)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="reach"
              type="natural"
              fill="url(#fillReach)"
              fillOpacity={0.4}
              stroke="var(--color-reach)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Reach trending By{" "}
              <span
                className={`${
                  percentageChangeReach > 0
                    ? "text-[#34C759]"
                    : percentageChangeReach === 0
                    ? "text-[#FF9500]"
                    : "text-[#FF3B30]"
                } ml-auto flex items-center`}
              >
                {percentageChangeReach}%
                {percentageChangeReach > 0 ? (
                  <LucideArrowUpRight className="h-4 w-4 ml-1" />
                ) : percentageChangeReach === 0 ? null : (
                  <LucideArrowDownLeft className="h-4 w-4 ml-1" />
                )}
              </span>{" "}
              past week
            </div>
            <div className="text-muted-foreground">
              Show reach trends from last week.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
    :<></>
  );
};

export default DailyReach;
