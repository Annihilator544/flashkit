import { SectionTab } from 'polotno/side-panel';
import { LucideChartArea } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';
import { AreaChartDisplay } from '../components/charts/AreaChartDisplay';
import BarChartDisplay from '../components/charts/BarChartDisplay';
import { InsightsChart } from '../components/charts/InsightsChart';
import LineChartDisplay from '../components/charts/LineChartDisplay';
import { MonthlyEngagementChart } from '../components/charts/MonthlyEngagementChart';
import RadarChartDisplay from '../components/charts/RadarChartDisplay';
import RadialChartDisplay from '../components/charts/RadialChartDisplay';
import html2canvas from 'html2canvas';
import ChartsVector from '../assets/ChartsVector.svg'
import DailyFollowerChart from '../components/InstagramCharts/DailyFollowerChart';
import { useInstagramData } from 'store/use-instagram-data';
import DailyImpressionsChart from '../components/InstagramCharts/DailyImpressionsChart';
import DailyReachChart from '../components/InstagramCharts/DailyReachChart';
import DemographicsChart from '../components/InstagramCharts/DemographicsChart';
import DailyCommentsChart from '../components/YoutubeCharts/DailyCommentsChart';
import DailyLikeShareDislikeChart from '../components/YoutubeCharts/DailyLikeShareDislikeChart';
import DailySubscribedUnsubscribedChart from '../components/YoutubeCharts/DailySubscribedUnsubscribedChart';
import DailyWatchMetricsChart from '../components/YoutubeCharts/DailyWatchMetricsChart';
import DailyCommentsYoutube from '../components/YoutubeCharts/DailyComments';
import DailyFollower from '../components/InstagramCharts/DailyFollowers';
import DailyLikeShareDislikeYoutube from '../components/YoutubeCharts/DailyLikeShareDislike';
import DailyImpressions from '../components/InstagramCharts/DailyImpressions';
import DailyReach from '../components/InstagramCharts/DailyReach';
import Demographics from '../components/InstagramCharts/Demographics';
import DialySubscribedUnsubscribed from '../components/YoutubeCharts/DailySubscribedUnsubscribed';


const ChartWrapper = observer(({ children, store, name }) => {
  const chartRef = useRef(null);

  const handleClick = useCallback(async () => {
    if (!chartRef.current) return;
    //get chartcontainer from current ref
    const chartContainer = chartRef.current.querySelector('.recharts-wrapper');

    try {
      // Convert the chart to canvas
      const canvas = await html2canvas(chartContainer, {
        backgroundColor: null,
        scale: 2, // Higher resolution
      });

      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/png');

      // Get the dimensions of the chart
      const { width, height } = chartRef.current.getBoundingClientRect();

      // Calculate position for the new element
      const { width: pageWidth, height: pageHeight } = store.activePage;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;

      // Create a new image element on the canvas
      store.activePage?.addElement({
        type: 'image',
        src: imageData,
        x,
        y,
        width,
        height,
        name: `${name} Chart`,
      });
    } catch (error) {
      console.error('Error converting chart to image:', error);
    }
  }, [store, name]);

  return (
    <div 
      className="cursor-pointer hover:bg-gray-200 bg-gray-100 p-4 rounded-2xl"
      onClick={handleClick}
      ref={chartRef}
    >
      {children}
    </div>
  );
});

export const ChartSection = {
  name: 'chart',
  Tab: (props) => (
    <SectionTab name="Charts" {...props}>
      <img src={ChartsVector} alt= "Charts" className="w-6 h-6"/>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    return (
      <div className="overflow-y-auto h-full flex flex-col gap-2">
        <ChartWrapper store={store} name="Monthly Engagement">
          <MonthlyEngagementChart />
        </ChartWrapper>
        <ChartWrapper store={store} name="Radar">
          <DailyCommentsYoutube />
        </ChartWrapper>
        <ChartWrapper store={store} name="Area">
          <DailyFollower />
        </ChartWrapper>
        <ChartWrapper store={store} name="Radial">
          <DailyLikeShareDislikeYoutube />
        </ChartWrapper>
        <ChartWrapper store={store} name="Bar">
          <DailyImpressions />
        </ChartWrapper>
        <ChartWrapper store={store} name="Insights">
          <DailyReach />
        </ChartWrapper>
        <ChartWrapper store={store} name="Line">
          <Demographics />
        </ChartWrapper>
        <ChartWrapper store={store} name="Radar">
          <DialySubscribedUnsubscribed />
        </ChartWrapper>
        <ChartWrapper store={store} name="Radar">
          <DailyWatchMetricsChart />
        </ChartWrapper>
      </div>
    );
  }),
};