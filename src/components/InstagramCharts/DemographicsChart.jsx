import { Pie, PieChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useInstagramData } from "store/use-instagram-data";
import countryNames from "../../lib/InstagramCountries";

const chartConfig = {
  demographics: {
    label: "Demographics",
  },
  chartColors: ["#D300C5", "#5806E0", "#FF6BF5", "#FF5A5F", "#6A0DAD"],
};

const DemographicsChart = () => {
  const { instagramData } = useInstagramData();
  const demographicData = instagramData.demographicData;

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
    topCountries.length ? <ChartContainer config={chartConfig}>
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
          outerRadius={80}
        />
      </PieChart>
    </ChartContainer>
    :<></>
  );
};

export default DemographicsChart;
