import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useYoutubeData } from "store/use-youtube-data";

const chartConfig = {
  likes: {
    label: "Likes",
    color: "hsl(var(--youtube-chart-1))",
  },
  shares: {
    label: "Shares",
    color: "hsl(var(--youtube-chart-2))",
  },
  dislikes: {
    label: "Dislikes",
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

const DailyLikeShareDislikeChart = () => {
  const { youtubeData } = useYoutubeData();

  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date),
      likes: youtubeData.daily[date].likes,
      shares: youtubeData.daily[date].shares,
      dislikes: youtubeData.daily[date].dislikes,
    }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="likes"
          stackId="a"
          fill="var(--color-likes)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="dislikes"
          stackId="a"
          fill="var(--color-dislikes)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="shares"
          stackId="a"
          fill="var(--color-shares)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default DailyLikeShareDislikeChart;
