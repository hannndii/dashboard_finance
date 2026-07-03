'use client';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MONOCHROME_COLORS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'];

export function SalesPerformanceChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Belum cukup data grafik
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 16, left: -8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis
          dataKey="_id"
          tickFormatter={(value) => String(value).split('-')[2]}
          stroke="#64748b"
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis
          stroke="#64748b"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value) => `Rp${Math.round(Number(value) / 1000)}k`}
        />
        <Tooltip
          cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          contentStyle={{
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 10px rgb(15 23 42 / 0.08)',
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#0f172a"
          strokeWidth={3}
          dot={{ r: 4, stroke: '#0f172a', strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopSellingProductDonutChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Belum cukup data grafik
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={MONOCHROME_COLORS[index % MONOCHROME_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 10px rgb(15 23 42 / 0.08)',
          }}
          formatter={(value: number | undefined) => [value || 0, 'Quantity']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value: string, entry: any) => `${entry.payload.name}: ${entry.payload.value}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}