"use client";

import { useState, useRef, useEffect } from 'react';
import MiniSpark from '@/components/organisms/MiniSpark';

interface ProjectionHeaderProps {
    netPatrimony?: string;
    variation?: string;
    onClientChange?: (client: { id: string; name: string }) => void;
}

export default function ProjectionHeader({
    netPatrimony = 'R$ 2.679.930,00',
    variation = '+52,37%',
    onClientChange,
}: ProjectionHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
    const [localSelectedClient, setLocalSelectedClient] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
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
                console.log('Fetching clients from http://localhost:3333/clients...');
                const res = await fetch('http://localhost:3333/clients');
                if (!res.ok) {
                    console.error('Failed to fetch clients:', res.status);
                    return;
                }
                const data = await res.json();
                console.log('Clients data received:', data);
                if (mounted && data.success && Array.isArray(data.data)) {
                    setClients(data.data);
                    if (data.data.length > 0) {
                        setLocalSelectedClient(data.data[0].name);
                        if (typeof onClientChange === 'function') onClientChange(data.data[0]);
                    }
                }
            } catch (err) {
                console.error('Error fetching clients:', err);
            }
        };
        fetchClients();
        return () => { mounted = false; };
    }, []);

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
                setIsDropdownOpen(false);
                if (typeof onClientChange === 'function') onClientChange({ id: c.id, name: c.name });
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsDropdownOpen(false);
        }
    };

    // Timeline scenarios (10 years cada)
    const scenariosData = [
        {
            year: '2025',
            age: '45 anos',
            label: 'Hoje',
            isToday: true,
        },
        {
            year: '2035',
            age: '55 anos',
            isToday: false,
        },
        {
            year: '2045',
            age: '65 anos',
            isToday: false,
        },
    ];

    // Deterministic pseudo-random helpers to avoid SSR/client hydration mismatch
    const hashString = (str: string) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h << 5) - h + str.charCodeAt(i);
            h |= 0;
        }
        return Math.abs(h);
    };

    const seededFraction = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const seriesForYear = (seedBase: string) => {
        const arr: number[] = [];
        for (let i = 0; i < 10; i++) {
            const seed = hashString(`${seedBase}-${i}`) + i;
            arr.push(30 + seededFraction(seed) * 70);
        }
        return arr;
    };

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
                                {localSelectedClient}
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

                        {/* Dropdown: Quando aberto, ele cria uma borda em "U" que sai das laterais do seletor */}
                        {isDropdownOpen && (
                            <div className="absolute top-[30px] left-0 right-0 z-20">
                                {/* 
                                    A borda em "U":
                                    - Começa no meio da altura do seletor (top-[30px])
                                    - border-t-0 remove a linha de cima
                                    - rounded-b-[32px] mantém o fundo arredondado
                                */}
                                <div className="w-full border-2 border-t-0 border-[#C9C9C9] rounded-b-[32px] bg-[#101010] flex flex-col overflow-hidden shadow-2xl">
                                    {/* Espaço para compensar a sobreposição com o seletor */}
                                    <div className="h-[32px] w-full"></div>

                                    {/* Conteúdo do Dropdown */}
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
                            <p className="text-[19px] font-medium text-[#68AAF1] font-work-sans">
                                {variation}
                            </p>
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
                            {scenariosData.map((scenario, idx) => (
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

                                    {/* Mini chart - agora ocupa o espaço disponível */}
                                    <div className="relative z-10 flex-1 bg-[rgba(103,119,250,0.08)] rounded-[4px] flex items-end justify-center p-2 min-h-[100px]">
                                        <MiniSpark data={seriesForYear(scenario.year)} />
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
                                            <p className={`text-sm font-medium font-work-sans ${scenario.isToday ? 'text-[#E6E6E6]' : 'text-white'}`}>
                                                {scenario.age}
                                            </p>
                                            {!scenario.isToday && (
                                                <p className="text-xs font-medium text-[#68AAF1] font-work-sans">
                                                    {idx === 1 ? '+18,37%' : '+12,45%'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Extra scrollable items */}
                            {[2055, 2065, 2075].map((year, idx) => (
                                <div
                                    key={year}
                                    className="flex-shrink-0 relative flex flex-col"
                                    style={{ width: '280px', flexBasis: '280px' }}
                                >
                                    <div
                                        className="absolute w-[1px] bg-[#444444]"
                                        style={{
                                            left: '-24px',
                                            top: '0',
                                            bottom: '0',
                                            height: '100%',
                                        }}
                                    />

                                    <div className="relative z-10 flex-1 bg-[rgba(103,119,250,0.08)] rounded-[4px] flex items-end justify-center p-2 min-h-[100px]">
                                        <MiniSpark data={seriesForYear(String(year))} colorFrom="#292D52" colorTo="#292D52" />
                                    </div>

                                    <div
                                        className="relative z-10 w-full my-4"
                                        style={{
                                            borderTop: idx % 2 === 0
                                                ? '1px solid #444444'
                                                : '1px dashed #444444',
                                        }}
                                    />

                                    <div className="relative z-10 space-y-1 pb-2">
                                        <p className="text-sm font-medium text-white font-work-sans">
                                            {year}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white font-work-sans">
                                                {65 + (idx + 1) * 10} anos
                                            </p>
                                            <p className="text-xs font-medium text-[#68AAF1] font-work-sans">
                                                {(() => {
                                                    const seed = hashString(`${year}-pct-${idx}`) + idx;
                                                    return `+${Math.floor(8 + seededFraction(seed) * 12)}%`;
                                                })()}
                                            </p>
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
