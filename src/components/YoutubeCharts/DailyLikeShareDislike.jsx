import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";

const DailyLikeShareDislikeYoutube = ({ youtubeData }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      likes: youtubeData.daily[date].likes,
      shares: youtubeData.daily[date].shares,
      dislikes: youtubeData.daily[date].dislikes,
    }));

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();
  const daysAgoMonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString("default", { month: "long" });
  const daysAgoYear = new Date(date).getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Likes, Shares, and Dislikes</p>
        <p className="text-secondary">{`${daysAgoMonth} ${daysAgoYear} to ${currentMonth} ${currentYear}`}</p>
      </CardHeader>
      <CardContent className="p-0 pr-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="likes" fill="#FF6B6B" name="Likes" />
              <Bar dataKey="shares" fill="#FF4C4C" name="Shares" />
              <Bar dataKey="dislikes" fill="#D72638" name="Dislikes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="text-secondary text-sm">
          Compare engagement metrics (likes, shares, and dislikes) over the last 90 days.
        </p>
      </CardFooter>
    </Card>
  );
};

export default DailyLikeShareDislikeYoutube;
