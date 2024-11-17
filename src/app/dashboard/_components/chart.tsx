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
import { useMemo } from 'react';

export const description = 'A pie chart with a legend';

export default function Chart({
  title,
  data,
}: {
  title: string;
  data?: { name: string; count: number }[];
}) {
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    let colorIndex = 1; // Start at 1

    data?.forEach((item) => {
      if (!config[item.name]) {
        config[item.name] = {
          label: item.name,
          color: `hsl(var(--chart-${colorIndex}))`,
        };
        colorIndex = (colorIndex % 7) + 1; // Increment and loop back to 1 after 7
      }
    });

    return config;
  }, [data]);

  const fillData = useMemo(() => {
    let colorIndex = 1; // Start at 1

    return data?.map((d) => {
      const fillItem = {
        ...d,
        fill: `hsl(var(--chart-${colorIndex}))`,
      };
      colorIndex = (colorIndex % 7) + 1; // Increment and loop back to 1 after 7
      return fillItem;
    });
  }, [data]);

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
              content={<ChartTooltipContent nameKey='count' hideLabel />}
            />
            <Pie data={fillData} dataKey='count' />
            <ChartLegend
              content={<ChartLegendContent nameKey='name' />}
              className='-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
