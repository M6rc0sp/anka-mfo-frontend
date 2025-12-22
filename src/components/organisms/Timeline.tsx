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
    const allYears = React.useMemo(() => [...salaryEvents, ...costEvents].map((e) => new Date(e.date).getFullYear()), [salaryEvents, costEvents]);
    const minYear = allYears.length ? Math.min(...allYears) : new Date().getFullYear();
    const maxYear = allYears.length ? Math.max(...allYears) : minYear + 35;
    const TICKS = 40;
    const labelStep = Math.max(1, Math.floor(TICKS / Math.min(8, maxYear - minYear + 1)));

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#48F7A1] font-abeezee text-sm w-16">Salário</span>
                    <div className="flex-1 relative">
                        <div className="h-[2px] bg-[#555] w-full absolute top-1/2 -translate-y-1/2"></div>
                        <div className="flex justify-between relative">
                            {Array.from({ length: TICKS }).map((_, i) => (
                                <div key={i} className="w-[2px] h-2 bg-[#555]"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-16"></div>
                    <div className="flex-1 relative h-16">
                        {salaryEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="absolute flex flex-col items-center"
                                style={{ left: `${(index / Math.max(1, salaryEvents.length - 1)) * 90}%`, top: '-15px' }}
                            >
                                <div className="mb-1 text-center whitespace-nowrap max-w-[120px]">
                                    <p className="text-[#48F7A1] text-xs font-abeezee font-semibold">{event.label}</p>
                                    {event.details && <p className="text-[#48F7A1] text-xs font-abeezee">{event.details}</p>}
                                </div>
                                <div className="w-3 h-3 rounded-full bg-[#48F7A1] border-2 border-[#48F7A1]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Year/age ruler */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-16"></div>
                <div className="flex-1 relative">
                    <div className="flex justify-between items-start">
                        {Array.from({ length: TICKS }).map((_, i) => {
                            const year = Math.round(minYear + (i / (TICKS - 1)) * (maxYear - minYear));
                            const showLabel = i % labelStep === 0;
                            return (
                                <div key={i} className="flex flex-col items-center" style={{ width: 0 }}>
                                    <div className="w-[2px] h-4 bg-[#555]"></div>
                                    {showLabel && (
                                        <>
                                            <div className="mt-2 text-white font-bold text-sm">{year}</div>
                                            <div className="text-[#C9C9C9] text-xs">{startAge + (year - minYear)}</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[#FF5151] font-abeezee text-sm w-16 leading-tight">Custo<br />de vida</span>
                    <div className="flex-1 relative">
                        <div className="h-[2px] bg-[#555] w-full absolute top-1/2 -translate-y-1/2"></div>
                        <div className="flex justify-between relative">
                            {Array.from({ length: TICKS }).map((_, i) => (
                                <div key={i} className="w-[2px] h-2 bg-[#555]"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="w-16"></div>
                    <div className="flex-1 relative h-10">
                        {costEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="absolute flex flex-col items-center"
                                style={{ left: `${(index / Math.max(1, costEvents.length - 1)) * 90}%`, top: '-15px' }}
                            >
                                <div className="w-3 h-3 rounded-full bg-[#FF5151] border-2 border-[#FF5151]"></div>
                                <p className="mt-3 text-[#FF5151] text-xs font-abeezee whitespace-nowrap">{event.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
