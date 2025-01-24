import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useInstagramData } from "store/use-instagram-data";

const chartConfig = {
  reach: {
    label: "Reach",
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

const DailyReachChart = () => {
  const { instagramData } = useInstagramData();
  const reachData = instagramData.daily;

  // Prepare data for the chart
  const chartData = Object.keys(reachData).slice(-7).map((date) => ({
    date: convertDateFormat(date),
    reach: reachData[date].reach,
  }));

  return (
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
  );
};

export default DailyReachChart;
