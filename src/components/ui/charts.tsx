// src/components/ui/charts.tsx
'use client';

import {Area,
  AreaChart as RechartsAreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  className?: string;
  yAxisWidth?: number;
  layout?: 'horizontal' | 'vertical';
}

interface PieChartProps {
  data: any[];
  index: string;
  category: string;
  className?: string;
}

export function AreaChart({
  data,
  index,
  categories,
  colors = ['blue'],
  yAxisWidth = 30,
  className,
}: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={index} />
          <YAxis width={yAxisWidth} />
          <Tooltip />
          {categories.map((category, i) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({
  data,
  index,
  categories,
  colors = ['blue'],
  layout = 'horizontal',
  className,
}: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {layout === 'horizontal' ? <XAxis dataKey={index} /> : <XAxis type="number" />}
          {layout === 'horizontal' ? <YAxis /> : <YAxis dataKey={index} type="category" />}
          <Tooltip />
          <Legend />
          {categories.map((category, i) => (
            <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LineChart({ data, index, categories, colors = ['blue'], className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({ data, index, category, className }: PieChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            nameKey={index}
            dataKey={category}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
