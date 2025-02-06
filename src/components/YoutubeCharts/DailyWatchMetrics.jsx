"use client";

import { CartesianGrid, LabelList, XAxis, YAxis, BarChart, Bar } from "recharts";

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
  estimatedMinutesWatched: {
    label: "Estimated Minutes Watched",
    color: "hsl(var(--youtube-chart-1))",
  },
  averageViewDuration: {
    label: "Average View Duration",
    color: "hsl(var(--youtube-chart-2))",
  },
  averageViewPercentage: {
    label: "Average View Percentage",
    color: "hsl(var(--youtube-chart-3))",
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

const DailyWatchMetrics = () => {
  const { youtubeData } = useYoutubeData();
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily||{})
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date), // X-axis value
      estimatedMinutesWatched: youtubeData.daily[date].estimatedMinutesWatched,
      averageViewDuration: youtubeData.daily[date].averageViewDuration,
      averageViewPercentage: youtubeData.daily[date].averageViewPercentage,
    }));

    const date = new Date();
    const formatedDate = formatDate(date);
    const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
    const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    chartData.length ?<Card className=" flex flex-col flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Watch Metrics</CardTitle>
        <CardDescription>{`${formatedDateWeekAgo} to ${formatedDate}`}</CardDescription>
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
              axisLine={false}
              hide
            />
            <XAxis dataKey="estimatedMinutesWatched" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="estimatedMinutesWatched"
              layout="vertical"
              fill="var(--color-estimatedMinutesWatched)"
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
                dataKey="estimatedMinutesWatched"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-auto">
        <div className="leading-none text-muted-foreground">
          Analyze key watch metrics over the past week.
        </div>
      </CardFooter>
    </Card>
    :<></>
  );
};

export default DailyWatchMetrics;
