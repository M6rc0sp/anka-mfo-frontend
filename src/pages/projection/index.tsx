import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import Header from '@/components/organisms/Header';
import ProjectionHeader from '@/components/organisms/ProjectionHeader';
import dynamic from 'next/dynamic';

const ProjectionChartClient = dynamic(() => import('@/components/organisms/ProjectionChartClient'), { ssr: false });

export default function ProjectionPage() {
    const [selectedClient, setSelectedClient] = React.useState<string>('Matheus Silveira');
    return (
        <DashboardLayout activeMenuItem="clientes">
            <Header activeTab="projecao" />

            <main className="container-main py-8">
                {/* Projection Header with client select, patrimony and mini charts */}
                <ProjectionHeader
                    selectedClient={selectedClient}
                    netPatrimony="R$ 2.679.930,00"
                    variation="+52,37%"
                    onClientChange={(name) => setSelectedClient(name)}
                />

                <div className="grid grid-cols-3 gap-6">
                    <section className="col-span-2">
                        <div className="card-base p-6">
                            <h2 className="text-section-title">Projeção Patrimonial</h2>
                            <div className="mt-4">
                                <div className="h-[420px] rounded-[32px] bg-[#1B1B1B] p-4">
                                    {/* ProjectionChart will render here */}
                                    <div id="projection-chart" className="h-full">
                                        {/* Client-only chart */}
                                        <ProjectionChartClient selectedClient={selectedClient} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 card-base p-6">
                            <h3 className="text-lg font-semibold text-white">Simulações</h3>
                            <div className="mt-4 h-24 bg-[#1D1F1E] rounded-md flex items-center justify-center text-[#C9C9C9]">[SimulationSelector placeholder]</div>
                        </div>
                    </section>

                    <aside>
                        <div className="card-base p-6">
                            <h3 className="text-lg font-semibold text-[#C9C9C9]">Resumo</h3>
                            <div className="mt-4 text-white">Patrimônio atual: R$ 100.000</div>
                        </div>

                        <div className="mt-6 card-base p-6">
                            <h3 className="text-lg font-semibold text-[#C9C9C9]">Filtros</h3>
                            <div className="mt-4 space-y-3 text-[#C9C9C9]">[Filtro 1]<br />[Filtro 2]</div>
                        </div>
                    </aside>
                </div>
            </main>
        </DashboardLayout>
    );
}
