'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: Array<{ timestamp: string; value: number }>;
  title: string;
  type?: 'line' | 'bar';
}

export default function Chart({ data, title, type = 'line' }: ChartProps) {
  // Transform data for recharts
  const chartData = data.map((item, index) => ({
    name: `Point ${index + 1}`,
    value: item.value,
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
  }));

  return (
    <div className="w-full h-96">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            labelFormatter={(label) => `Data Point: ${label}`}
            formatter={(value: any, name: string) => [value, 'Performance']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Performance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
