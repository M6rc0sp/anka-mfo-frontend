'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';

interface ChartDataPoint {
    year: number;
    idealProjection?: number;      // Linha azul tracejada - projeção ideal
    realizedHistory?: number;      // Linha laranja sólida - histórico real
    projectedFromReal?: number;    // Linha verde tracejada - previsão baseada no real
}

interface SignificantChange {
    year: number;
    value: number;
}

interface ProjectionChartProps {
    idealProjection: { year: number; value: number }[];      // Projeção ideal do plano
    realizedHistory: { year: number; value: number }[];      // Histórico real de investimentos
    projectedFromReal?: { year: number; value: number }[];   // Previsão baseada no real
    significantChanges?: SignificantChange[];                 // Pontos de alteração brusca
}

// Formata valores em R$ com abreviação (K, M) - padrão Figma
const formatCurrencyAxis = (value: number): string => {
    if (value === 0) return 'R$ 0';
    if (value >= 1_000_000) {
        const millions = value / 1_000_000;
        // Usa vírgula como separador decimal (padrão BR)
        return `R$ ${millions.toFixed(1).replace('.', ',')} M`;
    }
    if (value >= 1_000) {
        return `R$ ${Math.round(value / 1_000)}K`;
    }
    return `R$ ${Math.round(value)}`;
};

// Formata valores para tooltip (mais detalhado)
const formatCurrencyTooltip = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

export default function ProjectionChart({ 
    idealProjection, 
    realizedHistory, 
    projectedFromReal,
    significantChanges = []
}: ProjectionChartProps) {
    // Merge all series into unified data points
    const pointsMap = new Map<number, ChartDataPoint>();
    
    // Add ideal projection (linha azul tracejada)
    idealProjection.forEach((p) => {
        const existing = pointsMap.get(p.year) || { year: p.year };
        existing.idealProjection = p.value;
        pointsMap.set(p.year, existing);
    });
    
    // Add realized history (linha laranja sólida)
    realizedHistory.forEach((p) => {
        const existing = pointsMap.get(p.year) || { year: p.year };
        existing.realizedHistory = p.value;
        pointsMap.set(p.year, existing);
    });
    
    // Add projected from real (linha verde tracejada)
    if (projectedFromReal) {
        projectedFromReal.forEach((p) => {
            const existing = pointsMap.get(p.year) || { year: p.year };
            existing.projectedFromReal = p.value;
            pointsMap.set(p.year, existing);
        });
    }
    
    const chartData = Array.from(pointsMap.values()).sort((a, b) => a.year - b.year);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1D1F1E] border border-[#333] rounded-lg p-3 shadow-lg">
                    <p className="text-[#C9C9C9] font-medium mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {formatCurrencyTooltip(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid 
                        stroke="#333" 
                        strokeDasharray="3 3" 
                        horizontal={true} 
                        vertical={false} 
                    />
                    <XAxis 
                        dataKey="year" 
                        tick={{ fill: '#757575', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickLine={{ stroke: '#333' }}
                    />
                    <YAxis 
                        tick={{ fill: '#757575', fontSize: 12 }}
                        axisLine={{ stroke: '#333' }}
                        tickLine={{ stroke: '#333' }}
                        tickFormatter={formatCurrencyAxis}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Linha azul tracejada - Projeção Ideal */}
                    <Line 
                        type="monotone" 
                        dataKey="idealProjection" 
                        name="Projeção Ideal"
                        stroke="#5B8DEF" 
                        strokeWidth={2.5}
                        strokeDasharray="8 4"
                        dot={false}
                        connectNulls
                    />
                    
                    {/* Linha laranja sólida - Histórico Real */}
                    <Line 
                        type="monotone" 
                        dataKey="realizedHistory" 
                        name="Histórico Real"
                        stroke="#F5A623" 
                        strokeWidth={2.5}
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            // Só mostra ponto se for mudança significativa
                            const isSignificant = significantChanges.some(
                                sc => sc.year === payload.year
                            );
                            if (isSignificant) {
                                return (
                                    <circle 
                                        key={`dot-${payload.year}`}
                                        cx={cx} 
                                        cy={cy} 
                                        r={6} 
                                        fill="#F5A623" 
                                        stroke="#1D1F1E"
                                        strokeWidth={2}
                                    />
                                );
                            }
                            // Não mostra ponto em anos normais
                            return null;
                        }}
                        connectNulls
                    />
                    
                    {/* Linha verde tracejada - Previsão baseada no Real */}
                    <Line 
                        type="monotone" 
                        dataKey="projectedFromReal" 
                        name="Previsão"
                        stroke="#4ADE80" 
                        strokeWidth={2.5}
                        strokeDasharray="8 4"
                        dot={false}
                        connectNulls
                    />
                    
                    {/* Reference dots for significant changes */}
                    {significantChanges.map((change, i) => (
                        <ReferenceDot
                            key={i}
                            x={change.year}
                            y={change.value}
                            r={8}
                            fill="#F5A623"
                            stroke="#fff"
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
