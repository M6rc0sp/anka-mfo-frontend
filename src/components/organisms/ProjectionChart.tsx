'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ProjectionChartProps {
    series: { name: string; data: { x: number; y: number }[] }[];
}

export default function ProjectionChart({ series }: ProjectionChartProps) {
    // Merge series into a single dataset keyed by x
    const pointsMap = new Map<number, any>();
    series.forEach((s, si) => {
        s.data.forEach((p) => {
            const existing = pointsMap.get(p.x) || { x: p.x };
            existing[`y${si}`] = p.y;
            pointsMap.set(p.x, existing);
        });
    });
    const chartData = Array.from(pointsMap.values()).sort((a, b) => a.x - b.x);

    const colors = ['#6777FA', '#03B6AD', '#5880EF', '#F59E0B', '#EF4444'];

    return (
        <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid stroke="#222" />
                    <XAxis dataKey="x" tick={{ fill: '#9E9E9E' }} />
                    <YAxis tick={{ fill: '#9E9E9E' }} />
                    <Tooltip />
                    <Legend />
                    {series.map((s, i) => (
                        <Line key={s.name} type="monotone" dataKey={`y${i}`} stroke={colors[i % colors.length]} dot={false} strokeWidth={2} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
