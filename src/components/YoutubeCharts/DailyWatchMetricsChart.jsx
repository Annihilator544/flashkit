import { CartesianGrid, LabelList, XAxis, YAxis, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
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

function convertDateFormat(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}

const DailyWatchMetricsChart = () => {
  const { youtubeData } = useYoutubeData();

  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date),
      estimatedMinutesWatched: youtubeData.daily[date].estimatedMinutesWatched,
      averageViewDuration: youtubeData.daily[date].averageViewDuration,
      averageViewPercentage: youtubeData.daily[date].averageViewPercentage,
    }));

  return (
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
  );
};

export default DailyWatchMetricsChart;
