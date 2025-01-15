import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import countryNames from "../../lib/InstagramCountries";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: "#fff", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p><strong>{data.country}</strong></p>
        <p>Engaged Audience: {data.engaged_audience_demographics}</p>
        <p>Reached Audience: {data.reached_audience_demographics}</p>
        <p>Follower Demographics: {data.follower_demographics}</p>
      </div>
    );
  }
  return null;
};

const Demographics = ({ demographicData }) => {
  // Aggregate total contributions for each country
  const totalContributions = Object.entries(demographicData).map(([country, values]) => ({
    country: countryNames[country] || country,
    ...values,
    total: Object.values(values).reduce((sum, value) => sum + value, 0),
  }));

  // Get the top 5 countries by contributions
  const topCountries = totalContributions
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Colors for the pie chart slices
  const COLORS = ["#D300C5", "#5806E0", "#FF6BF5", "#FF5A5F", "#6A0DAD"];

  return (
    <Card className="max-w-4xl mx-auto flex-1 flex flex-col bg-[#f6f8f9] shadow-md">
      <CardHeader>
        <p className="text-[#252C32] font-semibold text-lg">
          Top 5 Countries by Demographics
        </p>
        <p className="text-secondary">
        lifetime data
        </p>
      </CardHeader>
      <CardContent className="p-0 pr-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topCountries}
                dataKey="total"
                nameKey="country"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label={(entry) => entry.country}
              >
                {topCountries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="text-secondary text-sm mt-auto">
        This chart shows the contributions of the top 5 countries based on the combined demographics.
      </CardFooter>
    </Card>
  );
};

export default Demographics;
