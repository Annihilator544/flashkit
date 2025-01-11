import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";

const DailySubscribersYoutube = ({ youtubeData, percentageChangeSubscribers }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      subscribers: youtubeData.daily[date].subscribers, // Y-axis value (net change)
    }));

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();
  const daysAgoMonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString("default", { month: "long" });
  const daysAgoYear = new Date(date).getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Subscribers Growth</p>
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
              <Area
                type="monotone"
                dataKey="subscribers"
                stroke="#FF2853"
                fill="#FF2853"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="flex font-semibold gap-1 text-sm">
          Trending By
          <span
            className={`${
              percentageChangeSubscribers > 0
                ? "text-[#34C759]"
                : percentageChangeSubscribers === 0
                ? "text-[#FF9500]"
                : "text-[#FF3B30]"
            } ml-auto flex`}
          >
            {percentageChangeSubscribers}%
            {percentageChangeSubscribers > 0 ? (
              <LucideArrowUpRight className="h-4 w-4 mt-auto" />
            ) : percentageChangeSubscribers === 0 ? (
              <></>
            ) : (
              <LucideArrowDownLeft className="h-4 w-4 mt-auto" />
            )}
          </span>{" "}
          past 90 days
        </p>
        <p className="text-secondary text-sm">Show net subscriber change over the last 90 days.</p>
      </CardFooter>
    </Card>
  );
};

export default DailySubscribersYoutube;
