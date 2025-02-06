import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useYoutubeData } from "store/use-youtube-data";

function formatDate(date) {
  const options = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

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

const DailyCommentsChart = () => {
  const { youtubeData } = useYoutubeData();

  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily||{})
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date),
      comments: youtubeData.daily[date].comments,
      views: youtubeData.daily[date].views,
      subscribers: youtubeData.daily[date].subscribers,
    }));

  return (
    chartData.length ?<ChartContainer config={chartConfig}>
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
          dot={{ fill: "var(--color-comments)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="var(--color-views)"
          strokeWidth={2}
          dot={{ fill: "var(--color-views)" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="subscribers"
          stroke="var(--color-subscribers)"
          strokeWidth={2}
          dot={{ fill: "var(--color-subscribers)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
    :<></>
  );
};

export default DailyCommentsChart;
