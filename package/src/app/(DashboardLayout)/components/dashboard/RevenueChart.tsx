'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import type { ApexOptions } from 'apexcharts';
import type { MonthlyRevenuePoint } from '@/lib/db/queries/dashboard';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type RevenueChartProps = {
  data: MonthlyRevenuePoint[];
};

export function RevenueChart({ data }: RevenueChartProps) {
  const categories = data.map((point) => point.period);
  const seriesData = data.map((point) => point.total);

  const options: ApexOptions = {
    chart: {
      id: 'revenue-chart',
      toolbar: { show: false },
      sparkline: { enabled: false },
      fontFamily: 'inherit',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories,
      labels: {
        rotate: 0,
        formatter: (val) => {
          const [year, month] = String(val).split('-');
          return `${month}/${year.slice(-2)}`;
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          }).format(val),
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.5,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    colors: ['#5D87FF'],
    grid: {
      strokeDashArray: 4,
    },
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardHeader
        title={<Typography variant="h6">Revenus cumulés</Typography>}
        subheader="Somme des montants des versions publiées"
      />
      <CardContent>
        <ApexChart
          type="area"
          height={320}
          options={options}
          series={[
            {
              name: 'Revenus',
              data: seriesData,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
