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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { useYoutubeData } from "store/use-youtube-data";

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--youtube-chart-1))",
  },
  subscribed: {
    label: "Subscribed",
    color: "hsl(var(--youtube-chart-2))",
  },
  unsubscribed: {
    label: "Unsubscribed",
    color: "hsl(var(--youtube-chart-3))",
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

const DialySubscribedUnsubscribed = () => {
  const { youtubeData, youtubeCalculatedData } = useYoutubeData();
  const percentageChangeViews = youtubeCalculatedData.percentageChangeViews;
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily||{})
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date), // X-axis value
      views: youtubeData.daily[date].views,
      subscribed: youtubeData.daily[date].subscribed,
      unsubscribed: youtubeData.daily[date].unsubscribed,
    }));

    const date = new Date();
    const formatedDate = formatDate(date);
    const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
    const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    chartData.length ?<Card className=" flex flex-col flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">View Metrics</CardTitle>
        <CardDescription>{`${formatedDateWeekAgo} to ${formatedDate}`}</CardDescription>
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillSubscribed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-subscribed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-subscribed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUnsubscribed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-unsubscribed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-unsubscribed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="views"
              fill="url(#fillViews)"
              fillOpacity={0.4}
              stroke="var(--color-views)"
              stackId="a"
            />
            <Area
              dataKey="subscribed"
              fill="url(#fillSubscribed)"
              fillOpacity={0.4}
              stroke="var(--color-subscribed)"
              stackId="a"
            />
            <Area
              dataKey="unsubscribed"
              fill="url(#fillUnsubscribed)"
              fillOpacity={0.4}
              stroke="var(--color-unsubscribed)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-auto">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
          <p className="flex font-semibold gap-1 text-sm">
              Views trending By
              <span
                className={`${
                  percentageChangeViews > 0
                    ? "text-[#34C759]"
                    : percentageChangeViews === 0
                    ? "text-[#FF9500]"
                    : "text-[#FF3B30]"
                } ml-2 flex items-center`}
              >
              {percentageChangeViews}%
                {percentageChangeViews > 0 ? (
                  <LucideArrowUpRight className="h-4 w-4 ml-1" />
                ) : percentageChangeViews === 0 ? null : (
                  <LucideArrowDownLeft className="h-4 w-4 ml-1" />
                )}
              </span>{" "}
              past week
            </p>
            <div className="leading-none text-muted-foreground">
              Compare views, subscribers, and unsubscribers for the last 7 days.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
    :<></>
  );
};

export default DialySubscribedUnsubscribed;
