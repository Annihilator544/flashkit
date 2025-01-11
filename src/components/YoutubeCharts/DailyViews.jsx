import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";

const DailyViewsYoutube = ({ youtubeData, percentageChangeViews }) => {
  // Prepare data for the chart
  const chartData = Object.keys(youtubeData.daily)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      date, // X-axis value
      views: youtubeData.daily[date].views, // Y-axis value
    }));
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const DaysAgomonth = new Date(date.setDate(date.getDate() - 90)).toLocaleString('default', { month: 'long' });
    const DaysAgoyear = new Date(date.setDate(date.getDate() - 90)).getFullYear();
  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Views Count</p>
        <p className="text-secondary">{ DaysAgomonth }{" "}{ DaysAgoyear } to { month }{" "}{ year }</p>
      </CardHeader>
      <CardContent className="p-0 pr-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#FF2853" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="flex font-semibold gap-1 text-sm">Trending By <p className={`${percentageChangeViews > 0 ? "text-[#34C759]": percentageChangeViews === 0 ? "text-[#FF9500]": "text-[#FF3B30]"} ml-auto flex`}>{percentageChangeViews}% {percentageChangeViews > 0 ? <LucideArrowUpRight className="h-4 w-4 mt-auto"/> : percentageChangeViews === 0 ? <></> : <LucideArrowDownLeft className="h-4 w-4 mt-auto"/>}</p> past 90 days</p>
        <p className="text-secondary text-sm">Show follower growth from last 3 months</p>
      </CardFooter>
    </Card>
  );
};

export default DailyViewsYoutube;
