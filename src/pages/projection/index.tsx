import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import Header from '@/components/organisms/Header';
import ProjectionHeader from '@/components/organisms/ProjectionHeader';
import dynamic from 'next/dynamic';

const ProjectionChartClient = dynamic(() => import('@/components/organisms/ProjectionChartClient'), { ssr: false });

export default function ProjectionPage() {
    const [selectedClient, setSelectedClient] = React.useState<{ id?: string; name: string }>({ name: '' });
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
                        <div className="wrapper-neutral p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-section-title">Projeção Patrimonial</h2>
                                <div className="flex items-center gap-6">
                                    <button className="text-[#C9C9C9] hover:text-white text-sm transition-colors">
                                        Ver com detalhes
                                    </button>
                                    <button className="text-[#C9C9C9] hover:text-white text-sm transition-colors">
                                        Ver como Tabela
                                    </button>
                                </div>
                            </div>
                            <div className="h-[420px] bg-projection-chart p-4">
                                {/* ProjectionChart will render here */}
                                <div id="projection-chart" className="h-full">
                                    {/* Client-only chart */}
                                    <ProjectionChartClient selectedClient={selectedClient.id} />
                                </div>
                            </div>
                        </div>

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
