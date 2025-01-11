import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const DailyCommentsYoutube = ({ youtubeData }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      comments: youtubeData.daily[date].comments, // Y-axis value
    }));

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();
  const daysAgoMonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString("default", { month: "long" });
  const daysAgoYear = new Date(date).getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Comments Over Time</p>
        <p className="text-secondary">{`${daysAgoMonth} ${daysAgoYear} to ${currentMonth} ${currentYear}`}</p>
      </CardHeader>
      <CardContent className="p-0 pr-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="comments"
                stroke="#FF6B6B" // A soft red color for the line
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="text-secondary text-sm">
          Track the number of comments received over the past 90 days.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DailyCommentsYoutube;
