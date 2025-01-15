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
import { LucideArrowDownLeft, LucideArrowUpRight } from "lucide-react";

const DailyFollower = ({ followerData, percentageChangeFollowers, numberOfDaysOfData }) => {
  // Prepare data for the chart
  const chartData = Object.keys(followerData)
    .map((date) => ({
      date, // X-axis value
      followers: followerData[date].follower_count, // Y-axis value
    }));

  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const daysAgoDate = new Date(date.setDate(date.getDate() - numberOfDaysOfData));
  const daysAgoMonth = daysAgoDate.toLocaleString("default", { month: "long" });
  const daysAgoYear = daysAgoDate.getFullYear();

  return (
    <Card className="max-w-4xl mx-auto flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">Follower Growth</p>
        <p className="text-secondary">
          {daysAgoMonth} {daysAgoYear} to {month} {year}
        </p>
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
                dataKey="followers"
                stroke="#D300C5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 items-start mt-4">
        <p className="flex font-semibold gap-1 text-sm">
          Trending By{" "}
          <p
            className={`${
              percentageChangeFollowers > 0
                ? "text-[#34C759]"
                : percentageChangeFollowers === 0
                ? "text-[#FF9500]"
                : "text-[#FF3B30]"
            } ml-auto flex`}
          >
            {percentageChangeFollowers}%{" "}
            {percentageChangeFollowers > 0 ? (
              <LucideArrowUpRight className="h-4 w-4 mt-auto" />
            ) : percentageChangeFollowers === 0 ? (
              <></>
            ) : (
              <LucideArrowDownLeft className="h-4 w-4 mt-auto" />
            )}
          </p>{" "}
          past {numberOfDaysOfData} days
        </p>
        <p className="text-secondary text-sm">
          Show follower growth from the last {numberOfDaysOfData%29} months
        </p>
      </CardFooter>
    </Card>
  );
};

export default DailyFollower;
