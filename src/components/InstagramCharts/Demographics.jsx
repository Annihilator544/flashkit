"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import countryNames from "../../lib/InstagramCountries";

const chartConfig = {
  demographics: {
    label: "Demographics",
  },
  chartColors: ["#D300C5", "#5806E0", "#FF6BF5", "#FF5A5F", "#6A0DAD"],
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-white shadow-md rounded-md text-sm border border-gray-200">
        <p className="font-bold">{data.country} hi</p>
        <p>Engaged Audience: {data.engaged_audience_demographics}</p>
        <p>Reached Audience: {data.reached_audience_demographics}</p>
        <p>Follower Demographics: {data.follower_demographics}</p>
        <p className="font-semibold">Total: {data.total}</p>
      </div>
    );
  }
  return null;
};

const Demographics = ({ demographicData }) => {
  // Aggregate total contributions for each country
  const totalContributions = Object.entries(demographicData).map(
    ([country, values]) => ({
      country: countryNames[country] || country,
      ...values,
      total: Object.values(values).reduce((sum, value) => sum + value, 0),
    })
  );

  // Get the top 5 countries by contributions
  const topCountries = totalContributions
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      fill: chartConfig.chartColors[index % chartConfig.chartColors.length],
    }));
  return (
    <Card className=" flex flex-col flex-1 bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <CardTitle className="text-[#252C32] font-semibold text-lg">Demographics</CardTitle>
        <CardDescription>Lifetime Data</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-full"
        >
          <PieChart>
          <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={{
                          "--color-bg": item.payload.fill, // Dynamically set color
                        }}
                      />
                      <div className="ml-2">
                        <strong className="block text-foreground">
                          {item.payload.country}
                        </strong>
                        <div className="text-xs text-muted-foreground">
                          Engaged Audience: {item.payload.engaged_audience_demographics}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Reached Audience: {item.payload.reached_audience_demographics}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Follower Demographics: {item.payload.follower_demographics}
                        </div>
                        <div className="text-xs font-medium text-foreground mt-1">
                          Total: {value}
                        </div>
                      </div>
                    </>
                  )}
                />
              }
            />

            <Pie
              data={topCountries}
              dataKey="total"
              nameKey="country"
              cx="50%"
              cy="50%"
              outerRadius={100}
            />
          </PieChart>
          <CustomTooltip />
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-5 text-sm">
      <div className="flex flex-wrap gap-4">
          {topCountries.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-muted-foreground text-xs">
                {item.country}
              </span>
            </div>
          ))}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing demographic contributions by the top 5 countries.
        </div>
      </CardFooter>
    </Card>
  );
};

export default Demographics;
