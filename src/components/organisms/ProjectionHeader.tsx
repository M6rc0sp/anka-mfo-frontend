"use client";

import { useState, useRef, useEffect } from 'react';
import MiniSpark from '@/components/organisms/MiniSpark';

interface ProjectionHeaderProps {
    onClientChange?: (client: { id: string; name: string }) => void;
}

interface ProjectionData {
    yearly: Array<{ year: number; totalAssets: number }>;
    summary: {
        initialAssets: number;
        finalAssets: number;
        totalGrowthPercent: number;
    };
}

export default function ProjectionHeader({
    onClientChange,
}: ProjectionHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [clients, setClients] = useState<Array<{ id: string; name: string; birthdate?: string }>>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
    const [localSelectedClient, setLocalSelectedClient] = useState<string>('');
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [selectedClientBirthdate, setSelectedClientBirthdate] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [projectionData, setProjectionData] = useState<ProjectionData | null>(null);
    const [loading, setLoading] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    // Fetch clients from backend when component mounts
    useEffect(() => {
        let mounted = true;
        const fetchClients = async () => {
            try {
                const res = await fetch('http://localhost:3333/clients');
                if (!res.ok) return;
                const data = await res.json();
                if (mounted && data.success && Array.isArray(data.data)) {
                    setClients(data.data);
                    if (data.data.length > 0) {
                        const firstClient = data.data[0];
                        setLocalSelectedClient(firstClient.name);
                        setSelectedClientId(firstClient.id);
                        setSelectedClientBirthdate(firstClient.birthdate || '');
                        if (typeof onClientChange === 'function') onClientChange(firstClient);
                    }
                }
            } catch (err) {
                console.error('Error fetching clients:', err);
            }
        };
        fetchClients();
        return () => { mounted = false; };
    }, []);

    // Fetch projection data when client changes
    useEffect(() => {
        if (!selectedClientId) return;
        let mounted = true;
        const fetchProjection = async () => {
            setLoading(true);
            try {
                // First get simulations for client
                const simsRes = await fetch(`http://localhost:3333/clients/${selectedClientId}/simulations`);
                if (!simsRes.ok) return;
                const simsData = await simsRes.json();
                const sims = simsData.success && Array.isArray(simsData.data) ? simsData.data : [];
                const sim = sims[0];
                if (!sim || !sim.id) {
                    if (mounted) setProjectionData(null);
                    return;
                }

                // Then get projection
                const projRes = await fetch(`http://localhost:3333/simulations/${sim.id}/projection`);
                if (!projRes.ok) return;
                const projData = await projRes.json();
                if (mounted) {
                    setProjectionData(projData);
                }
            } catch (err) {
                console.error('Error fetching projection:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchProjection();
        return () => { mounted = false; };
    }, [selectedClientId]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isDropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            setIsDropdownOpen(true);
            setHighlightedIndex(0);
            return;
        }

        if (!isDropdownOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => (clients.length ? (prev + 1) % clients.length : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => (clients.length ? (prev - 1 + clients.length) % clients.length : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const c = clients[highlightedIndex];
            if (c) {
                setLocalSelectedClient(c.name);
                setSelectedClientId(c.id);
                setSelectedClientBirthdate(c.birthdate || '');
                setIsDropdownOpen(false);
                if (typeof onClientChange === 'function') onClientChange({ id: c.id, name: c.name });
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsDropdownOpen(false);
        }
    };

    // Format currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        }).format(value);
    };

    // Format percentage
    const formatPercentage = (value: number): string => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(2)}%`;
    };

    // Calculate age from birthdate
    const calculateAge = (birthdate: string, year: number): number => {
        if (!birthdate) return 0;
        const birthYear = new Date(birthdate).getFullYear();
        return year - birthYear;
    };

    // Get current year
    const currentYear = new Date().getFullYear();

    // Build timeline scenarios from projection data
    const buildTimelineScenarios = () => {
        if (!projectionData || !projectionData.yearly || projectionData.yearly.length === 0) {
            return [];
        }

        const yearly = projectionData.yearly;
        const scenarios = [];
        
        // Add current year (first)
        const firstYear = yearly[0];
        if (firstYear) {
            scenarios.push({
                year: String(firstYear.year),
                age: selectedClientBirthdate ? `${calculateAge(selectedClientBirthdate, firstYear.year)} anos` : '',
                label: 'Hoje',
                isToday: true,
                totalAssets: firstYear.totalAssets,
                data: yearly.slice(0, Math.min(10, yearly.length)).map(y => y.totalAssets),
            });
        }

        // Add every 10 years
        const intervals = [10, 20];
        intervals.forEach(interval => {
            const yearData = yearly.find(y => y.year === currentYear + interval);
            if (yearData) {
                const startIdx = yearly.findIndex(y => y.year === yearData.year - 9);
                const endIdx = yearly.findIndex(y => y.year === yearData.year);
                const sliceData = startIdx >= 0 && endIdx >= 0 
                    ? yearly.slice(startIdx, endIdx + 1).map(y => y.totalAssets)
                    : [];
                
                // Calculate growth from previous period
                const prevYearData = yearly.find(y => y.year === yearData.year - 10);
                const growth = prevYearData 
                    ? ((yearData.totalAssets - prevYearData.totalAssets) / prevYearData.totalAssets) * 100
                    : 0;

                scenarios.push({
                    year: String(yearData.year),
                    age: selectedClientBirthdate ? `${calculateAge(selectedClientBirthdate, yearData.year)} anos` : '',
                    isToday: false,
                    totalAssets: yearData.totalAssets,
                    growth: growth,
                    data: sliceData.length > 0 ? sliceData : [yearData.totalAssets],
                });
            }
        });

        return scenarios;
    };

    const scenarios = buildTimelineScenarios();

    // Normalize data for mini spark (0-100 range)
    const normalizeData = (data: number[]): number[] => {
        if (data.length === 0) return [];
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        return data.map(v => ((v - min) / range) * 70 + 30);
    };

    // Get patrimony values from projection
    const netPatrimony = projectionData?.summary?.initialAssets 
        ? formatCurrency(projectionData.summary.initialAssets)
        : loading ? 'Carregando...' : 'R$ 0,00';
    
    const variation = projectionData?.summary?.totalGrowthPercent 
        ? formatPercentage(projectionData.summary.totalGrowthPercent)
        : '';

    return (
        <div className="wrapper-neutral p-8 mb-8">
            {/* Main Grid: Left (1/3) + Timeline (2/3) */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* LEFT COLUMN (4/12) */}
                <div className="col-span-4 flex flex-col justify-between">
                    {/* Client Selector */}
                    <div className="relative w-[80%]">
                        {/* O seletor principal (sempre visível) */}
                        <div
                            tabIndex={0}
                            onKeyDown={handleKeyDown}
                            className={`flex items-center justify-between p-4 bg-[#101010] cursor-pointer hover:border-[#E6E6E6] transition-colors rounded-[32px] border-2 border-[#C9C9C9] relative z-30`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="text-xl font-medium text-white font-work-sans">
                                {localSelectedClient || 'Selecione um cliente'}
                            </span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`text-[#C9C9C9] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path
                                    d="M4 6L8 10L12 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        {/* Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-[30px] left-0 right-0 z-20">
                                <div className="w-full border-2 border-t-0 border-[#C9C9C9] rounded-b-[32px] bg-[#101010] flex flex-col overflow-hidden shadow-2xl">
                                    <div className="h-[32px] w-full"></div>
                                    <div className="p-4 pt-2">
                                        <div className="text-[#9E9E9E] text-sm">
                                            {clients.length === 0 && <div>Carregando clientes...</div>}
                                            {clients.length > 0 && (
                                                <div className="flex flex-col max-h-60 overflow-auto custom-scrollbar">
                                                    {clients.map((c, i) => (
                                                        <div
                                                            key={c.id}
                                                            className={`px-3 py-2 rounded-md cursor-pointer ${i === highlightedIndex ? 'bg-[rgba(88,128,239,0.12)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}
                                                            onMouseEnter={() => setHighlightedIndex(i)}
                                                            onMouseDown={() => {
                                                                setLocalSelectedClient(c.name);
                                                                setSelectedClientId(c.id);
                                                                setSelectedClientBirthdate(c.birthdate || '');
                                                                setIsDropdownOpen(false);
                                                                if (typeof onClientChange === 'function') onClientChange({ id: c.id, name: c.name });
                                                            }}
                                                        >
                                                            <span className="text-white text-sm">{c.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Net Patrimony Section (bottom of left column) */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium text-[#7B7B7B] font-satoshi mb-3">
                            Patrimônio Líquido Total
                        </h3>
                        <div className="flex items-baseline gap-1">
                            <p className="text-[39px] font-medium text-[#757575] font-work-sans leading-tight">
                                {netPatrimony}
                            </p>
                            {variation && (
                                <p className="text-[19px] font-medium text-[#68AAF1] font-work-sans">
                                    {variation}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - TIMELINE CAROUSEL (8/12) */}
                <div className="col-span-8 flex flex-col">
                    {/* Timeline Container with scroll but hidden scrollbar */}
                    <div className="relative flex-1" style={{ overflow: 'hidden' }}>
                        {/* Fade gradient overlay (right side) */}
                        <div
                            className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
                            style={{
                                background: 'linear-gradient(to right, rgba(6, 6, 6, 0), rgba(6, 6, 6, 1))',
                            }}
                        />

                        {/* Scrollable timeline with hidden scrollbar and drag */}
                        <div
                            ref={carouselRef}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                overflowX: 'auto',
                                overflowY: 'hidden',
                                scrollBehavior: isDragging ? 'auto' : 'smooth',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                cursor: isDragging ? 'grabbing' : 'grab',
                                userSelect: 'none',
                            }}
                            className="flex gap-8 h-full"
                        >
                            <style>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>

                            {loading && (
                                <div className="flex items-center justify-center w-full text-[#757575]">
                                    Carregando projeção...
                                </div>
                            )}

                            {!loading && scenarios.length === 0 && (
                                <div className="flex items-center justify-center w-full text-[#757575]">
                                    Nenhuma projeção disponível
                                </div>
                            )}

                            {!loading && scenarios.map((scenario, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 relative flex flex-col"
                                    style={{ width: '280px', flexBasis: '280px' }}
                                >
                                    {/* Vertical line - full height */}
                                    <div
                                        className="absolute w-[1px] bg-[#444444]"
                                        style={{
                                            left: '-24px',
                                            top: '0',
                                            bottom: '0',
                                            height: '100%',
                                        }}
                                    />

                                    {/* Mini chart */}
                                    <div className={`relative z-10 flex-1 rounded-[4px] flex items-end justify-center p-2 min-h-[100px] ${scenario.isToday ? 'bg-[rgba(103,119,250,0.08)]' : 'bg-[rgba(41,45,82,0.3)]'}`}>
                                        <MiniSpark 
                                            data={normalizeData(scenario.data || [])} 
                                            colorFrom={scenario.isToday ? '#6777FA' : '#292D52'}
                                            colorTo={scenario.isToday ? '#03B6AD' : '#292D52'}
                                        />
                                    </div>

                                    {/* Horizontal line */}
                                    <div
                                        className="relative z-10 w-full my-4"
                                        style={{
                                            borderTop: idx % 2 === 0
                                                ? '1px solid #444444'
                                                : '1px dashed #444444',
                                        }}
                                    />

                                    {/* Text */}
                                    <div className="relative z-10 space-y-1 pb-2">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-medium font-work-sans ${scenario.isToday ? 'text-[#68AAF1]' : 'text-white'}`}>
                                                {scenario.year}
                                            </p>
                                            {scenario.isToday && (
                                                <div className="inline-flex items-center justify-center px-1.5 py-0.5 bg-[rgba(88,128,239,0.24)] rounded-[2px]">
                                                    <span className="text-xs font-medium text-[#5880EF] font-work-sans">
                                                        Hoje
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {scenario.age && (
                                                <p className={`text-sm font-medium font-work-sans ${scenario.isToday ? 'text-[#E6E6E6]' : 'text-white'}`}>
                                                    {scenario.age}
                                                </p>
                                            )}
                                            {!scenario.isToday && scenario.growth !== undefined && (
                                                <p className="text-xs font-medium text-[#68AAF1] font-work-sans">
                                                    {formatPercentage(scenario.growth)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
