import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const DailyWatchMetrics = ({ youtubeData }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      estimatedMinutesWatched: youtubeData.daily[date].estimatedMinutesWatched,
      averageViewDuration: youtubeData.daily[date].averageViewDuration,
      averageViewPercentage: youtubeData.daily[date].averageViewPercentage,
    }));

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();
  const daysAgoMonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString("default", { month: "long" });
  const daysAgoYear = new Date(date).getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Watch Metrics</p>
        <p className="text-secondary">{`${daysAgoMonth} ${daysAgoYear} to ${currentMonth} ${currentYear}`}</p>
      </CardHeader>
      <CardContent className="p-0 pr-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="estimatedMinutesWatched"
                stroke="#FF6B6B"
                fill="#FF6B6B"
                fillOpacity={0.3}
                name="Estimated Minutes Watched"
              />
              <Area
                type="monotone"
                dataKey="averageViewDuration"
                stroke="#FF4C4C"
                fill="#FF4C4C"
                fillOpacity={0.3}
                name="Average View Duration"
              />
              <Area
                type="monotone"
                dataKey="averageViewPercentage"
                stroke="#D72638"
                fill="#D72638"
                fillOpacity={0.3}
                name="Average View Percentage"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="text-secondary text-sm">
          Analyze key watch metrics over the past 90 days.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DailyWatchMetrics;
