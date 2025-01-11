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

const DialySubscribedUnsubscribed = ({ youtubeData, percentageChangeViews }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      views: youtubeData.daily[date].views,
      subscribed: youtubeData.daily[date].subscribed,
      unsubscribed: youtubeData.daily[date].unsubscribed,
    }));

  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
  const currentYear = date.getFullYear();
  const daysAgoMonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString("default", { month: "long" });
  const daysAgoYear = new Date(date).getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Views, Subscribed, and Unsubscribed</p>
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
              <Area type="monotone" dataKey="views" stackId="1" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.3} />
              <Area type="monotone" dataKey="subscribed" stackId="1" stroke="#FF4C4C" fill="#FF4C4C" fillOpacity={0.3} />
              <Area type="monotone" dataKey="unsubscribed" stackId="1" stroke="#D72638" fill="#D72638" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
            <p className="flex font-semibold gap-1 text-sm">Trending By <p className={`${percentageChangeViews > 0 ? "text-[#34C759]": percentageChangeViews === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{percentageChangeViews}% {percentageChangeViews > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : percentageChangeViews === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p> past 90 days</p>
            <p className="text-secondary text-sm">Show trends in views, subscribers, and unsubscribers for the last 90 days.</p>
      </CardFooter>
    </Card>
  );
};

export default DialySubscribedUnsubscribed;
