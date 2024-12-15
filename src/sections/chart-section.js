import { SectionTab } from 'polotno/side-panel';
import { LucideChartArea, LucideChartBar } from 'lucide-react';
import React, { useCallback, useRef } from 'react';
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
import { Card, CardDescription } from '../components/ui/card';


export const ChartSection = {
  name: 'chart',
  Tab: (props) => (
    <SectionTab name="Charts" {...props}>
      <img src={ChartsVector} alt= "Charts" className="w-6 h-6"/>
    </SectionTab>
  ),
  Panel: observer(({ store }) => {
    return (
      <div className="overflow-y-auto h-full flex flex-col gap-2 p-2">
        <p className='font-semibold'>Bar</p>
        <div className='grid grid-cols-2'>
          <Card className="aspect-square flex justify-between align-middle">
              <LucideChartBar className=' w-10 h-10 text-black m-auto' />
          </Card>
        </div>
      </div>
    );
  }),
};