'use client';

import dynamic from 'next/dynamic';
import type { ApexOptions } from 'apexcharts';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import type { RevenueByMonth } from '@/lib/db/queries/dashboard';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type RevenueChartProps = {
  data: RevenueByMonth[];
};

const RevenueChart = ({ data }: RevenueChartProps) => {
  const categories = data.map((item) => {
    const [year, month] = item.month.split('-').map(Number);
    const date = new Date(year, (month ?? 1) - 1);
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  });

  const series = [
    {
      name: 'Revenue',
      data: data.map((item) => Number(item.total.toFixed(2))),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#7C8FAC',
          fontFamily: 'inherit',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `$${Math.round(value).toLocaleString()}`,
      },
    },
    fill: {
      type: 'gradient' as const,
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    colors: ['#5D87FF'],
    grid: {
      strokeDashArray: 4,
      borderColor: '#EAEFF4',
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$${Math.round(value).toLocaleString()}`,
      },
    },
  };

  const total = series[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Revenue trend"
        subheader="Published offers revenue (current versions)"
        action={
          <Typography variant="subtitle2" color="primary">
            Total ${total.toLocaleString()}
          </Typography>
        }
      />
      <CardContent>
        <ApexChart options={options} series={series} type="area" height={320} />
      </CardContent>
    </Card>
  );
};

export default RevenueChart;

