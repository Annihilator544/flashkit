
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

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

const DailyLikeShareDislikeYoutube = ({ youtubeData }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .slice(-7)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date: convertDateFormat(date), // X-axis value
      likes: youtubeData.daily[date].likes,
      shares: youtubeData.daily[date].shares,
      dislikes: youtubeData.daily[date].dislikes,
    }));

    const date = new Date();
    const formatedDate = formatDate(date);
    const dateWeekAgo = new Date(date.setDate(date.getDate() - 7))
    const formatedDateWeekAgo = formatDate(dateWeekAgo);

  return (
    <Card className="flex-1 bg-[#f6f8f9] shadow-md flex flex-col">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Likes, Shares, and Dislikes</CardTitle>
        <CardDescription>{`${formatedDateWeekAgo} to ${formatedDate}`}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-auto">
        <div className="leading-none text-muted-foreground">
          Compare engagement metrics (likes, shares, and dislikes) over the last 7 days.
        </div>
      </CardFooter>
    </Card>
  );
};

export default DailyLikeShareDislikeYoutube;
