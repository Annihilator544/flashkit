import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useInstagramData } from "store/use-instagram-data";

const chartConfig = {
  followers: {
    label: "Followers",
    color: "hsl(var(--instagram-chart-1))",
  },
};

function convertDateFormat(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}

const DailyFollowerChart = () => {
    const {instagramData} = useInstagramData();
    const followerData = instagramData.daily;
  // Prepare data for the chart
  const chartData = Object.keys(followerData).slice(-7).map((date) => ({
    date: convertDateFormat(date),
    followers: followerData[date].follower_count,
  }));

  return (
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
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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
  );
};

export default DailyFollowerChart;
