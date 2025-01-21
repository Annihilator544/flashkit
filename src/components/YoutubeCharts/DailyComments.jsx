import { LucideArrowDownLeft, LucideArrowUpRight, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer, Tooltip } from "recharts";

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


const chartConfig = {
  comments: {
    label: "Comments",
    color: "hsl(var(--youtube-chart-1))",
  },
  views: {
    label: "Views",
    color: "hsl(var(--youtube-chart-2))",
  },
  subscribers: {
    label: "Subscribers",
    color: "hsl(var(--youtube-chart-3))",
  },
};

const DailyCommentsYoutube = ({ youtubeData , percentageChangeSubscribers }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date), //date is the key of the object
      comments: youtubeData.daily[date].comments, // Y-axis value
      views: youtubeData.daily[date].views, // Y-axis value
      subscribers: youtubeData.daily[date].subscribers,
    }));

  const date = new Date();
  const formatedDate = formatDate(date);
  const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
  const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    <Card className=" flex flex-col flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Views, Subscribers and Comments</CardTitle>
        <CardDescription>{`${formatedDateWeekAgo} to ${formatedDate}`}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="var(--color-comments)"
                strokeWidth={2}
                dot={{
                fill: "var(--color-comments)",
              }}
              activeDot={{
                r: 6,
              }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={{
                fill: "var(--color-views)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <Line
                type="monotone"
                dataKey="subscribers"
                stroke="var(--color-subscribers)"
                strokeWidth={2}
                dot={{
                fill: "var(--color-subscribers)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-auto">
      <p className="flex font-semibold gap-1 text-sm">
                Subscribers trending By
                <span
                  className={`${
                    percentageChangeSubscribers > 0
                      ? "text-[#34C759]"
                      : percentageChangeSubscribers === 0
                      ? "text-[#FF9500]"
                      : "text-[#FF3B30]"
                  } ml-auto flex`}
                >
                  {percentageChangeSubscribers}%
                  {percentageChangeSubscribers > 0 ? (
                    <LucideArrowUpRight className="h-4 w-4 mt-auto" />
                  ) : percentageChangeSubscribers === 0 ? (
                    <></>
                  ) : (
                    <LucideArrowDownLeft className="h-4 w-4 mt-auto" />
                  )}
                </span>{" "}
                past week
              </p>
        <p className="text-secondary text-sm">
          Track the number of views, subscribers and comments received over the past 7 days.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DailyCommentsYoutube;
