import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
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

function convertDateFormat(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}

const DailySubscribedUnsubscribedChart = () => {
  const { youtubeData } = useYoutubeData();

  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily||{})
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date),
      views: youtubeData.daily[date].views,
      subscribed: youtubeData.daily[date].subscribed,
      unsubscribed: youtubeData.daily[date].unsubscribed,
    }));

  return (
    chartData.length ?<ChartContainer config={chartConfig}>
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
            <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.1} />
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
    :<></>
  );
};

export default DailySubscribedUnsubscribedChart;
