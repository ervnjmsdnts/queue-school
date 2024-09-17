'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A pie chart with a legend';

const chartData = [
  { browser: 'chrome', transactions: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', transactions: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', transactions: 187, fill: 'var(--color-firefox)' },
  { browser: 'edge', transactions: 173, fill: 'var(--color-edge)' },
  { browser: 'other', transactions: 90, fill: 'var(--color-other)' },
  { browser: 'another', transactions: 120, fill: 'var(--color-another)' },
];

const chartConfig = {
  transactions: {
    label: 'Transactions',
  },
  chrome: {
    label: 'Residential',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Agricultural',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Commercial',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Industrial',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Business Tax',
    color: 'hsl(var(--chart-5))',
  },
  another: {
    label: 'Cedula',
    color: 'hsl(var(--chart-6))',
  },
} satisfies ChartConfig;

export default function Chart({ title }: { title: string }) {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[300px]'>
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey='transactions' hideLabel />}
            />
            <Pie data={chartData} dataKey='transactions' />
            <ChartLegend
              content={<ChartLegendContent nameKey='browser' />}
              className='-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
