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

    return (
        <DashboardLayout activeMenuItem="clientes">
            <Header activeTab="projecao" />

            <main className="container-main py-8">
                {/* Projection Header with client select, patrimony and mini charts */}
                <ProjectionHeader
                    onClientChange={(client) => setSelectedClient(client)}
                />

                <div className="grid grid-cols-1 gap-6">
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
                            </div>
                        </div>

                        {/* Timeline Section */}
                        <div className="mt-6 wrapper-neutral p-6 bg-[#101010] rounded-[25px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#67AEFA] font-abeezee text-lg">Timeline</h3>
                                <button className="bg-black border border-[#BBBBBB] rounded-full px-4 py-1 text-[#D9D9D9] text-sm font-abeezee">
                                    Hoje
                                </button>
                            </div>
                            {/* render client-only Timeline to avoid SSR hydrate mismatches */}
                            <ClientTimeline salaryEvents={salaryEvents} costEvents={costEvents} startAge={45} />
                        </div>

                    </section>
                </div>
            </main>
        </DashboardLayout>
    );
}
