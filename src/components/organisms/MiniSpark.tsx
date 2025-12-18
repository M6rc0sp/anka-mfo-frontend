'use client';

import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MiniSparkProps {
    data: number[];
    colorFrom?: string;
    colorTo?: string;
    height?: number;
}

export default function MiniSpark({ data, colorFrom = '#6777FA', colorTo = '#03B6AD', height = 50 }: MiniSparkProps) {
    const chartData = data.map((v, i) => ({ x: i, y: v }));

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={colorFrom} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={colorTo} stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="y" stroke={colorFrom} fill="url(#grad)" strokeWidth={1.5} dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
