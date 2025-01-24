"use client";

import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

const chartConfig = {
  followers: {
    label: "Followers",
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

const DailyFollower = ({ followerData, percentageChangeFollowers, numberOfDaysOfData, className }) => {
  // Prepare data for the chart
  const chartData = Object.keys(followerData).slice(-7).map((date) => ({
    date: convertDateFormat(date), // X-axis value
    followers: followerData[date].follower_count, // Y-axis value
  }));

  const date = new Date();
  const formatedDate = formatDate(date);
  const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
  const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    <Card className={`flex flex-col flex-1 bg-[#f6f8f9] shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Follower Growth</CardTitle>
        <CardDescription>
        {formatedDateWeekAgo} to {formatedDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
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
              content={<ChartTooltipContent/>}
            />
            <Line
              dataKey="followers"
              type="natural"
              stroke="var(--color-followers)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-followers)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-auto">
        <div className="flex gap-2 font-medium leading-none">
          Followers trending By{" "}
          <span
            className={`${
              percentageChangeFollowers > 0
                ? "text-[#34C759]"
                : percentageChangeFollowers === 0
                ? "text-[#FF9500]"
                : "text-[#FF3B30]"
            } ml-2 flex items-center`}
          >
            {percentageChangeFollowers}%
            {percentageChangeFollowers > 0 ? (
              <LucideArrowUpRight className="h-4 w-4 ml-1" />
            ) : percentageChangeFollowers === 0 ? null : (
              <LucideArrowDownLeft className="h-4 w-4 ml-1" />
            )}
          </span>{" "}
          past week
        </div>
        <div className="leading-none text-muted-foreground">
          Show follower growth from last week.
        </div>
      </CardFooter>
    </Card>
  );
};

export default DailyFollower;
