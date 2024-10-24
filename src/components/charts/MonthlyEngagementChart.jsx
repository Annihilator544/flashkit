  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
  import { useYoutubeData } from "store/use-youtube-data";
  import { useEffect, useState } from "react";

  const monthlyData = [
    { month: "Jan", views: 100000, subscribers: 70000 },
    { month: "Feb", views: 120000, subscribers: 80000 },
    { month: "Mar", views: 110000, subscribers: 75000 },
    { month: "Apr", views: 140000, subscribers: 100000 },
    { month: "May", views: 130000, subscribers: 90000 },
    { month: "Jun", views: 125000, subscribers: 85000 },
  ];
  function transformData(inputData) {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return Object.entries(inputData).map(([dateString, data]) => {
      const [year, monthNumber] = dateString.split('-');
      const monthIndex = parseInt(monthNumber, 10) - 1; // Convert to 0-based index
      
      return {
        month: monthNames[monthIndex] + ' ' + year,
        views: data.views,
        subscribers: data.subscribers,
      };
    });
  }
  export function MonthlyEngagementChart() {
    const { data } = useYoutubeData();
    const [chartData, setChartData] = useState(monthlyData);
    useEffect(() => {
      Object.keys(data).length ? setChartData(transformData(data.monthly).slice(-6)) : setChartData(monthlyData);
    },[data]);  
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Monthly Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            width={500}
            height={300}
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData === monthlyData ? (
              <>
                <Line type="monotone" dataKey="views" stroke="#A9A9A9" name="Views" />
                <Line type="monotone" dataKey="subscribers" stroke="#4A4A4A" name="Subscribers" />
              </>
            ):(
              <>
                <Line type="monotone" dataKey="views" stroke="#F87171" name="Views" />
                <Line type="monotone" dataKey="subscribers" stroke="#3B82F6" name="Subscribers" />
              </>
              )}
          </LineChart>
        </CardContent>
        {chartData === monthlyData ?
        <CardFooter>
          Connect Your Youtube Account to see insights
        </CardFooter>
        : <></>}
      </Card>
    );
  }
