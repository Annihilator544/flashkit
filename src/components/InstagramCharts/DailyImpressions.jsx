"use client";

import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

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
  impressions: {
    label: "Impressions",
    color: "hsl(var(--instagram-chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
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

const DailyImpressions = ({
  className,
}) => {
  // Prepare data for the chart
  const { instagramData, instagramCalculatedData } = useInstagramData();
  const impressionsData = instagramData.daily;
  const percentageChangeImpressions = instagramCalculatedData.percentageChangeImpressions;
  const chartData = Object.keys(impressionsData).slice(-7).map((date) => ({
    date: convertDateFormat(date), // X-axis value
    impressions: impressionsData[date].impressions, // Y-axis value
  }));

  const date = new Date();
  const currentDateFormatted = date.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
  });
  const daysAgoDate = new Date(date.setDate(date.getDate() - 7));
  const daysAgoFormatted = daysAgoDate.toLocaleDateString("default", {
    month: "short",
    day: "numeric",
  });

  return (
    chartData.length ?<Card className={`flex flex-col flex-1 bg-[#f6f8f9] shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Impressions</CardTitle>
        <CardDescription>
          {daysAgoFormatted} to {currentDateFormatted}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="date"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}// Format date if needed
              hide
            />
            <XAxis dataKey="impressions" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="impressions"
              layout="vertical"
              fill="var(--color-impressions)"
              radius={4}
            >
              <LabelList
                dataKey="date"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="impressions"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Impressions trending By{" "}
          <span
            className={`${
              percentageChangeImpressions > 0
                ? "text-[#34C759]"
                : percentageChangeImpressions === 0
                ? "text-[#FF9500]"
                : "text-[#FF3B30]"
            } ml-2 flex items-center`}
          >
            {percentageChangeImpressions}%
            {percentageChangeImpressions > 0 ? (
              <LucideArrowUpRight className="h-4 w-4 ml-1" />
            ) : percentageChangeImpressions === 0 ? null : (
              <LucideArrowDownLeft className="h-4 w-4 ml-1" />
            )}
          </span>{" "}
          past week
        </div>
        <div className="leading-none text-muted-foreground">
          Show impressions trends from the last week.
        </div>
      </CardFooter>
    </Card>
    :<></>
  );
};

export default DailyImpressions;
