"use client";
import React from 'react';

export interface TimelineEvent {
    id: string;
    date: string;
    type: 'salary' | 'cost';
    label: string;
    value: number;
    details?: string;
}

interface TimelineProps {
    salaryEvents: TimelineEvent[];
    costEvents: TimelineEvent[];
    startAge?: number;
}

export default function Timeline({ salaryEvents, costEvents, startAge = 45 }: TimelineProps) {
    const { minYear, maxYear, labelStep, ticksCount } = React.useMemo(() => {
        const allYears = [...salaryEvents, ...costEvents].map((e) => new Date(e.date).getFullYear());
        const min = allYears.length ? Math.min(...allYears) : new Date().getFullYear();
        const max = allYears.length ? Math.max(...allYears) : min + 35;
        const span = max - min;
        const ticks = span + 1;
        // Favor 5-year steps for labels to match the taller ticks
        const step = 5;
        return { minYear: min, maxYear: max, labelStep: step, ticksCount: ticks };
    }, [salaryEvents, costEvents]);

    const getPosition = (date: string) => {
        const year = new Date(date).getFullYear();
        const percent = ((year - minYear) / Math.max(1, maxYear - minYear)) * 100;
        return `${percent}%`;
    };

    return (
        <div className="w-full">
            {/* Salário Timeline */}
            <div className="mb-2">
                <div className="flex items-center gap-3">
                    <span className="text-[#48F7A1] font-abeezee text-sm w-16">Salário</span>
                    <div className="flex-1 relative h-10 flex items-center">
                        {/* Linha base */}
                        <div className="h-[1px] bg-[#333] w-full absolute"></div>

                        {/* Marcadores de tempo (trastes) na linha */}
                        <div className="flex justify-between w-full absolute px-[1px] items-center">
                            {Array.from({ length: ticksCount }).map((_, i) => {
                                const isFiveYear = i % 5 === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-[1px] bg-[#555] ${isFiveYear ? 'h-3' : 'h-1.5'}`}
                                    ></div>
                                );
                            })}
                        </div>

                        {/* Eventos de Salário - Posicionados na linha */}
                        {salaryEvents.map((event, idx) => {
                            const pos = getPosition(event.date);
                            // Alternate label height to avoid overlap if events are close
                            const labelBottom = idx % 2 === 0 ? 'bottom-4' : 'bottom-10';

                            return (
                                <div
                                    key={event.id}
                                    className="absolute flex flex-col items-center"
                                    style={{ left: pos, transform: 'translateX(-50%)' }}
                                >
                                    {/* Label acima com offset alternado */}
                                    <div className={`absolute ${labelBottom} text-center whitespace-nowrap z-20`}>
                                        <p className="text-[#48F7A1] text-xs font-abeezee font-semibold">{event.label}</p>
                                        {event.details && <p className="text-[#48F7A1] text-[10px] font-abeezee opacity-80">{event.details}</p>}
                                    </div>
                                    {/* Bolinha */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#48F7A1] shadow-[0_0_8px_rgba(72,247,161,0.4)] z-10"></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Year/age ruler */}
            <div className="flex items-start gap-3 mb-2">
                <div className="w-16 flex flex-col gap-1">
                    <span className="text-white font-abeezee text-[10px] opacity-40 uppercase tracking-wider">Ano</span>
                    <span className="text-white font-abeezee text-[10px] opacity-40 uppercase tracking-wider">Idade</span>
                </div>
                <div className="flex-1 relative">
                    <div className="flex justify-between items-start">
                        {Array.from({ length: ticksCount }).map((_, i) => {
                            const year = minYear + i;
                            const showLabel = i % labelStep === 0 || i === 0 || i === ticksCount - 1;
                            return (
                                <div key={i} className="flex flex-col items-center" style={{ width: 0 }}>
                                    {showLabel && (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-white font-bold text-xs">{year}</span>
                                            <span className="text-[#888] text-[10px]">{startAge + (year - minYear)}</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Custo de Vida Timeline */}
            <div>
                <div className="flex items-center gap-3">
                    <span className="text-[#FF5151] font-abeezee text-sm w-16 leading-tight">Custo<br />de vida</span>
                    <div className="flex-1 relative h-10 flex items-center">
                        {/* Linha base */}
                        <div className="h-[1px] bg-[#333] w-full absolute"></div>

                        {/* Marcadores de tempo (trastes) na linha */}
                        <div className="flex justify-between w-full absolute px-[1px] items-center">
                            {Array.from({ length: ticksCount }).map((_, i) => {
                                const isFiveYear = i % 5 === 0;
                                return (
                                    <div
                                        key={i}
                                        className={`w-[1px] bg-[#555] ${isFiveYear ? 'h-3' : 'h-1.5'}`}
                                    ></div>
                                );
                            })}
                        </div>

                        {/* Eventos de Custo - Posicionados na linha */}
                        {costEvents.map((event, idx) => {
                            const pos = getPosition(event.date);
                            const labelTop = idx % 2 === 0 ? 'top-4' : 'top-10';
                            return (
                                <div
                                    key={event.id}
                                    className="absolute flex flex-col items-center"
                                    style={{ left: pos, transform: 'translateX(-50%)' }}
                                >
                                    {/* Bolinha */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5151] shadow-[0_0_8px_rgba(255,81,81,0.4)] z-10"></div>
                                    {/* Label abaixo com offset alternado */}
                                    <div className={`absolute ${labelTop} text-center whitespace-nowrap z-20`}>
                                        <p className="text-[#FF5151] text-xs font-abeezee font-semibold">{event.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
