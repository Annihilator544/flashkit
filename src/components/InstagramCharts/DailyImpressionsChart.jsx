import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
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

function convertDateFormat(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}

const DailyImpressionsChart = () => {
  const { instagramData } = useInstagramData();
  const impressionsData = instagramData.daily;

  // Prepare data for the chart
  const chartData = Object.keys(impressionsData).slice(-7).map((date) => ({
    date: convertDateFormat(date),
    impressions: impressionsData[date].impressions,
  }));

  return (
    chartData.length ?<ChartContainer config={chartConfig}>
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
    :<></>
  );
};

export default DailyImpressionsChart;
