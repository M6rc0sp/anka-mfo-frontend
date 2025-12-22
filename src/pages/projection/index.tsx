import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import Header from '@/components/organisms/Header';
import ProjectionHeader from '@/components/organisms/ProjectionHeader';
import dynamic from 'next/dynamic';

const ClientTimeline = dynamic(() => import('@/components/organisms/Timeline'), { ssr: false });

const ProjectionChartClient = dynamic(() => import('@/components/organisms/ProjectionChartClient'), { ssr: false });

// Interface para eventos da timeline
interface TimelineEvent {
    id: string;
    date: string;
    type: 'salary' | 'cost';
    label: string;
    value: number;
    details?: string;
}

export default function ProjectionPage() {
    const [selectedClient, setSelectedClient] = React.useState<{ id?: string; name: string }>({ name: '' });
    const [viewMode, setViewMode] = React.useState<'chart' | 'details' | 'table'>('chart');

    // Dados de exemplo da timeline (viriam da API)
    const salaryEvents: TimelineEvent[] = [
        { id: '1', date: '2025-01-01', type: 'salary', label: 'CLT: R$ 15.000', value: 15000 },
        { id: '2', date: '2027-01-01', type: 'salary', label: 'CLT: R$ 15.000', value: 15000, details: 'Autônomo: R$ 5.000' },
        { id: '3', date: '2032-01-01', type: 'salary', label: 'Autônomo: R$ 35.000', value: 35000 },
        { id: '4', date: '2045-01-01', type: 'salary', label: 'Aposentadoria', value: 0 },
    ];

    const costEvents: TimelineEvent[] = [
        { id: '1', date: '2025-01-01', type: 'cost', label: 'R$ 8.000', value: 8000 },
        { id: '2', date: '2028-01-01', type: 'cost', label: 'R$ 12.000', value: 12000 },
        { id: '3', date: '2035-01-01', type: 'cost', label: 'R$ 20.000', value: 20000 },
        { id: '4', date: '2042-01-01', type: 'cost', label: 'R$ 10.000', value: 10000 },
        { id: '5', date: '2050-01-01', type: 'cost', label: 'R$ 15.000', value: 15000 },
    ];

    // Timeline span (compute from events or use defaults)
    const allYears = [...salaryEvents, ...costEvents].map((e) => new Date(e.date).getFullYear());
    const minYear = allYears.length ? Math.min(...allYears) : new Date().getFullYear();
    const maxYear = allYears.length ? Math.max(...allYears) : minYear + 35; // default 35-year span
    const TICKS = 40;
    const START_AGE = 45; // default start age (overrideable later)
    const labelStep = Math.max(1, Math.floor(TICKS / Math.min(8, maxYear - minYear + 1))); // step for labels
    return (
        <DashboardLayout activeMenuItem="clientes">
            <Header activeTab="projecao" />

            <main className="container-main py-8">
                {/* Projection Header with client select, patrimony and mini charts */}
                <ProjectionHeader
                    onClientChange={(client) => setSelectedClient(client)}
                />

                <div className="grid grid-cols-3 gap-6">
                    <section className="col-span-2">
                        {/* Card do Gráfico de Projeção */}
                        <div className="wrapper-neutral p-6">
                            {/* Gráfico */}
                            <div className="bg-projection-chart p-4 rounded-lg">
                                {/* Header interno do card */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-section-title text-white font-abeezee text-xl">Projeção Patrimonial</h2>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setViewMode('details')}
                                            className={`text-sm transition-colors font-abeezee ${viewMode === 'details' ? 'text-[#FF9343]' : 'text-[#C9C9C9] hover:text-white'}`}
                                        >
                                            Ver com detalhes
                                        </button>
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`text-sm transition-colors font-abeezee ${viewMode === 'table' ? 'text-[#FF9343]' : 'text-[#C9C9C9] hover:text-white'}`}
                                        >
                                            Ver como Tabela
                                        </button>
                                    </div>
                                </div>
                                <div id="projection-chart" className="h-full">
                                    <ProjectionChartClient selectedClient={selectedClient.id} />
                                </div>

                            {/* Timeline Section - FORA do card do gráfico */}
                            <div className="mt-6 wrapper-neutral p-6 bg-[#101010] rounded-[25px]">
                                {/* render client-only Timeline to avoid SSR hydrate mismatches */}
                                <ClientTimeline salaryEvents={salaryEvents} costEvents={costEvents} startAge={45} />
                            </div>
                            </div>
                        </div>

                        {/* Timeline Section - FORA do card do gráfico */}
                        <div className="mt-6 wrapper-neutral p-6 bg-[#101010] rounded-[25px]">
                            <div className="rounded-[20px] border border-[#C9C9C9] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[#67AEFA] font-abeezee text-lg">Timeline</h3>
                                    <button className="bg-black border border-[#BBBBBB] rounded-full px-4 py-1 text-[#D9D9D9] text-sm font-abeezee">
                                        Hoje
                                    </button>
                                </div>
                            {/* Salário Timeline */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[#48F7A1] font-abeezee text-sm w-16">Salário</span>
                                    <div className="flex-1 relative">
                                        {/* Linha base */}
                                        <div className="h-[2px] bg-[#555] w-full absolute top-1/2 -translate-y-1/2"></div>
                                        {/* Marcadores de tempo */}
                                        <div className="flex justify-between relative">
                                            {Array.from({ length: TICKS }).map((_, i) => (
                                                <div key={i} className="w-[2px] h-2 bg-[#555]"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Year & Age ruler */}
                                <div className="flex items-center gap-3 mb-2">
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
                                                                <div className="text-[#C9C9C9] text-xs">{START_AGE + (year - minYear)}</div>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Eventos de Salário */}
                                <div className="flex items-start gap-3">
                                    <div className="w-16"></div>
                                    <div className="flex-1 relative h-16">
                                        {salaryEvents.map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="absolute flex flex-col items-center"
                                                style={{ left: `${(index / (salaryEvents.length - 1)) * 90}%`, top: '-15px' }}
                                            >
                                                {/* Label acima */}
                                                <div className="mb-1 text-center whitespace-nowrap">
                                                    <p className="text-[#48F7A1] text-xs font-abeezee font-semibold">{event.label}</p>
                                                    {event.details && (
                                                        <p className="text-[#48F7A1] text-xs font-abeezee">{event.details}</p>
                                                    )}
                                                </div>

                                                {/* Bolinha */}
                                                <div className="w-3 h-3 rounded-full bg-[#48F7A1] border-2 border-[#48F7A1]"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Custo de Vida Timeline */}
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[#FF5151] font-abeezee text-sm w-16 leading-tight">Custo<br />de vida</span>
                                    <div className="flex-1 relative">
                                        {/* Linha base */}
                                        <div className="h-[2px] bg-[#555] w-full absolute top-1/2 -translate-y-1/2"></div>
                                        {/* Marcadores de tempo */}
                                        <div className="flex justify-between relative">
                                            {Array.from({ length: TICKS }).map((_, i) => (
                                                <div key={i} className="w-[2px] h-2 bg-[#555]"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Eventos de Custo */}
                                <div className="flex items-start gap-3">
                                    <div className="w-16"></div>
                                    <div className="flex-1 relative h-10">
                                        {costEvents.map((event, index) => (
                                            <div
                                                key={event.id}
                                                className="absolute flex flex-col items-center"
                                                style={{ left: `${(index / (costEvents.length - 1)) * 90}%`, top: '-15px' }}
                                            >
                                                {/* Bolinha */}
                                                <div className="w-3 h-3 rounded-full bg-[#FF5151] border-2 border-[#FF5151]"></div>
                                                {/* Label abaixo */}
                                                <p className="mt-3 text-[#FF5151] text-xs font-abeezee whitespace-nowrap">{event.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>                        </div>
                        <div className="mt-6 wrapper-neutral p-6">
                            <h3 className="text-lg font-semibold text-white">Simulações</h3>
                            <div className="mt-4 h-24 bg-[#1D1F1E] rounded-md flex items-center justify-center text-[#C9C9C9]">
                                {selectedClient.id ? 'Selecione uma simulação para comparar' : 'Selecione um cliente primeiro'}
                            </div>
                        </div>
                    </section>

                    <aside>
                        <div className="wrapper-neutral p-6">
                            <h3 className="text-lg font-semibold text-[#C9C9C9]">Resumo</h3>
                            <div className="mt-4 text-white">
                                {selectedClient.name ? `Cliente: ${selectedClient.name}` : 'Nenhum cliente selecionado'}
                            </div>
                        </div>

                        <div className="mt-6 wrapper-neutral p-6">
                            <h3 className="text-lg font-semibold text-[#C9C9C9]">Filtros</h3>
                            <div className="mt-4 space-y-3 text-[#C9C9C9]">
                                <div>Período de projeção</div>
                                <div>Taxa de retorno</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </DashboardLayout>
    );
}
