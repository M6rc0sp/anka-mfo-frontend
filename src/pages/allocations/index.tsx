'use client';

import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import Header from '@/components/organisms/Header';
import AddAllocationModal from '@/components/organisms/AddAllocationModal';

interface Simulation {
    id: string;
    name: string;
}

interface Allocation {
    id: string;
    type: string;
    description: string;
    percentage: number;
    initialValue: number;
    annualReturn: number;
    allocationDate?: string;
    // Para imóveis financiados
    isFinanced?: boolean;
    totalValue?: number;
    paidInstallments?: number;
    totalInstallments?: number;
}

export default function AllocationsPage() {
    const [, setClients] = React.useState<{ id: string; name: string }[]>([]);
    const [, setSimulations] = React.useState<Simulation[]>([]);
    const [allocations, setAllocations] = React.useState<Allocation[]>([]);
    const [selectedClient, setSelectedClient] = React.useState<string>('');
    const [selectedSimulation, setSelectedSimulation] = React.useState<string>('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingAllocation, setEditingAllocation] = React.useState<Allocation | null>(null);
    const [addingType, setAddingType] = React.useState<'financeira' | 'imovel'>('financeira');
    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
    const dateInputRef = React.useRef<HTMLInputElement>(null);

    // Fetch clients
    React.useEffect(() => {
        fetch('http://localhost:3333/clients')
            .then(res => res.json())
            .then(data => {
                const clientList = data.success ? data.data : data;
                setClients(Array.isArray(clientList) ? clientList : []);
                if (clientList.length > 0) {
                    setSelectedClient(clientList[0].id);
                }
            })
            .catch(console.error);
    }, []);

    // Fetch simulations when client changes
    React.useEffect(() => {
        if (!selectedClient) {
            setSimulations([]);
            setAllocations([]);
            return;
        }

        fetch(`http://localhost:3333/clients/${selectedClient}/simulations`)
            .then(res => res.json())
            .then(data => {
                const simList = data.success ? data.data : data;
                setSimulations(Array.isArray(simList) ? simList : []);
                if (simList.length > 0) {
                    setSelectedSimulation(simList[0].id);
                }
            })
            .catch(console.error);
    }, [selectedClient]);

    // Fetch allocations when simulation changes
    React.useEffect(() => {
        if (!selectedSimulation) {
            setAllocations([]);
            return;
        }

        setLoading(true);
        fetch(`http://localhost:3333/simulations/${selectedSimulation}/allocations`)
            .then(res => res.json())
            .then(data => {
                const allocList = data.success ? data.data : data;
                setAllocations(Array.isArray(allocList) ? allocList : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedSimulation]);

    const handleAddAllocation = (type: 'financeira' | 'imovel') => {
        setAddingType(type);
        setEditingAllocation(null);
        setIsModalOpen(true);
    };

    const handleEditAllocation = (allocation: Allocation) => {
        setEditingAllocation(allocation);
        setIsModalOpen(true);
    };

    const handleDeleteAllocation = async (allocation: Allocation) => {
        if (!confirm(`Deseja realmente excluir "${allocation.description}"?`)) return;

        try {
            await fetch(`http://localhost:3333/allocations/${allocation.id}`, {
                method: 'DELETE',
            });
            setAllocations(prev => prev.filter(a => a.id !== allocation.id));
        } catch (error) {
            console.error('Error deleting allocation:', error);
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setShowDatePicker(false);
    };

    const handleUpdateAllocations = async () => {
        // Recarrega as alocações da data selecionada
        if (!selectedSimulation) return;

        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3333/simulations/${selectedSimulation}/allocations?date=${selectedDate}`
            );
            const data = await response.json();
            const allocList = data.success ? data.data : data;
            setAllocations(Array.isArray(allocList) ? allocList : []);
        } catch (error) {
            console.error('Error fetching allocations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAllocation = async (data: Partial<Allocation>) => {
        try {
            if (editingAllocation) {
                const res = await fetch(`http://localhost:3333/allocations/${editingAllocation.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await res.json();
                const updated = result.success ? result.data : result;
                setAllocations(prev => prev.map(a => a.id === editingAllocation.id ? updated : a));
            } else {
                const res = await fetch(`http://localhost:3333/allocations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        simulationId: selectedSimulation,
                        type: addingType,
                    }),
                });
                if (!res.ok) {
                    console.error('Failed to create allocation:', res.status);
                    return;
                }
                const result = await res.json();
                const created = result.success ? result.data : result;
                if (created && created.id) {
                    setAllocations(prev => [...prev, created]);
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving allocation:', error);
        }
    };

    // Separar alocações por tipo
    const financeiras = allocations.filter(a => a.type === 'financeira' || a.type === 'financial');
    const imobilizadas = allocations.filter(a => a.type === 'imovel' || a.type === 'property');

    // Calcular total
    const totalValue = allocations.reduce((sum, a) => sum + Number(a.initialValue || 0), 0);

    const formatCurrency = (value: number) => {
        if (value >= 1000000) {
            return `R$ ${(value / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} M`;
        }
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatCurrencyFull = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    // Prevent hydration issues
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <DashboardLayout activeMenuItem="clientes">
            <Header activeTab="alocacoes" />

            <main className="px-8 py-6">
                {/* Alocações Card - Estilo Figma */}
                <div
                    className="bg-[#101010] border-2 border-[#C9C9C9] rounded-[35px] p-6 relative"
                    style={{ minHeight: '577px' }}
                >
                    {/* Header do Card */}
                    <div className="flex items-start justify-between mb-6">
                        {/* Total Alocado */}
                        <div>
                            <p className="text-[#919191] text-sm font-abeezee">Total alocado</p>
                            <p className="text-[#C9C9C9] text-[32px] font-abeezee mt-1">
                                {formatCurrency(totalValue)}
                            </p>
                        </div>

                        {/* Data da Alocação */}
                        <div className="flex flex-col items-center relative">
                            <p className="text-[#919191] text-sm font-abeezee mb-2">Data da alocação</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setShowDatePicker(!showDatePicker);
                                        setTimeout(() => dateInputRef.current?.showPicker(), 0);
                                    }}
                                    className="flex items-center gap-2 bg-black border border-[#BBBBBB] rounded-full px-6 py-2 hover:border-[#FF9343] transition-colors"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: 'rotate(180deg)' }}>
                                        <path d="M2 4L6 8L10 4" stroke="#D9D9D9" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-[#D9D9D9] text-base font-abeezee">
                                        {formatDate(selectedDate)}
                                    </span>
                                </button>
                                {/* Input de data oculto */}
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="absolute opacity-0 pointer-events-none"
                                    style={{ left: '50%', top: '100%' }}
                                />

                                {/* Menu de três pontinhos */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                                        className="p-1 text-[#C9C9C9] hover:text-white transition-colors"
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="6" r="2" />
                                            <circle cx="12" cy="12" r="2" />
                                            <circle cx="12" cy="18" r="2" />
                                        </svg>
                                    </button>

                                    {showOptionsMenu && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setShowOptionsMenu(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 bg-[#1D1F1E] border border-[#C1C1C1] rounded-lg py-2 min-w-[150px] z-20 shadow-lg">
                                                <button
                                                    onClick={() => {
                                                        handleUpdateAllocations();
                                                        setShowOptionsMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-[#C9C9C9] hover:bg-[#2D2D2D] hover:text-white transition-colors font-abeezee text-sm"
                                                >
                                                    Recarregar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Exportar dados
                                                        const dataStr = JSON.stringify(allocations, null, 2);
                                                        const blob = new Blob([dataStr], { type: 'application/json' });
                                                        const url = URL.createObjectURL(blob);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `alocacoes-${selectedDate}.json`;
                                                        a.click();
                                                        setShowOptionsMenu(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-[#C9C9C9] hover:bg-[#2D2D2D] hover:text-white transition-colors font-abeezee text-sm"
                                                >
                                                    Exportar JSON
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botão Atualizar */}
                        <button
                            onClick={handleUpdateAllocations}
                            disabled={loading}
                            className="flex items-center gap-2 bg-[#FF9343] hover:bg-[#E08030] disabled:bg-[#555] rounded-full px-6 py-2 transition-colors"
                        >
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" className={loading ? 'animate-spin' : ''}>
                                <path d="M14.5 8.5C14.5 11.8137 11.8137 14.5 8.5 14.5C5.18629 14.5 2.5 11.8137 2.5 8.5C2.5 5.18629 5.18629 2.5 8.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                <path d="M8.5 2.5L11 5M8.5 2.5L11 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-white text-sm font-abeezee">
                                {loading ? 'Atualizando...' : 'Atualizar'}
                            </span>
                        </button>
                    </div>

                    {/* Colunas de Alocações */}
                    <div className="grid grid-cols-2 gap-8 mt-4">
                        {/* Coluna Financeiras */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#C9C9C9] text-base font-abeezee">Financeiras</h3>
                                <button
                                    onClick={() => handleAddAllocation('financeira')}
                                    className="flex items-center gap-2 text-[#FF9343] hover:opacity-80"
                                >
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <path d="M8.5 1.5V15.5M1.5 8.5H15.5" stroke="#FF9343" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-sm font-abeezee">Adicionar</span>
                                </button>
                            </div>

                            {/* Lista de Financeiras */}
                            <div className="space-y-4">
                                {loading && (
                                    <div className="text-center py-8 text-[#757575]">Carregando...</div>
                                )}
                                {!loading && financeiras.length === 0 && (
                                    <div className="bg-[#1D1F1E] border border-[#C1C1C1] border-dashed rounded-[15px] p-5 text-center text-[#757575]">
                                        Nenhuma alocação financeira
                                    </div>
                                )}
                                {financeiras.map(alloc => (
                                    <div
                                        key={alloc.id}
                                        className="bg-[#1D1F1E] border border-[#C1C1C1] rounded-[15px] p-5 flex items-center justify-between cursor-pointer hover:border-[#FF9343] transition-colors group"
                                    >
                                        <span
                                            onClick={() => handleEditAllocation(alloc)}
                                            className="text-white font-inter font-semibold text-base flex-1"
                                        >
                                            {alloc.description}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span
                                                onClick={() => handleEditAllocation(alloc)}
                                                className="text-white font-abeezee text-xl"
                                            >
                                                {formatCurrencyFull(alloc.initialValue)}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAllocation(alloc);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-[#919191] hover:text-red-500 transition-all"
                                                title="Excluir alocação"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Coluna Imobilizadas */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#C9C9C9] text-base font-abeezee">Imobilizadas</h3>
                                <button
                                    onClick={() => handleAddAllocation('imovel')}
                                    className="flex items-center gap-2 text-[#FF9343] hover:opacity-80"
                                >
                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <path d="M8.5 1.5V15.5M1.5 8.5H15.5" stroke="#FF9343" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-sm font-abeezee">Adicionar</span>
                                </button>
                            </div>

                            {/* Lista de Imobilizadas */}
                            <div className="space-y-4">
                                {loading && (
                                    <div className="text-center py-8 text-[#757575]">Carregando...</div>
                                )}
                                {!loading && imobilizadas.length === 0 && (
                                    <div className="bg-[#1D1F1E] border border-[#C1C1C1] border-dashed rounded-[15px] p-5 text-center text-[#757575]">
                                        Nenhuma alocação imobilizada
                                    </div>
                                )}
                                {imobilizadas.map(alloc => (
                                    <div
                                        key={alloc.id}
                                        className="bg-[#1D1F1E] border border-[#C1C1C1] rounded-[15px] p-5 cursor-pointer hover:border-[#FF9343] transition-colors group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div onClick={() => handleEditAllocation(alloc)} className="flex-1">
                                                <span className="text-white font-inter font-semibold text-base block">
                                                    {alloc.description}
                                                </span>
                                                {alloc.isFinanced && alloc.totalInstallments && (
                                                    <span className="text-[#919191] text-sm font-abeezee">
                                                        Progresso: {alloc.paidInstallments || 0}/{alloc.totalInstallments} parcelas
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {alloc.isFinanced && (
                                                    <span className="bg-white border border-[#EAEAEA] rounded-full px-3 py-1 text-[#2D2D2D] text-sm font-abeezee">
                                                        $ Financiado
                                                    </span>
                                                )}
                                                <div className="text-right" onClick={() => handleEditAllocation(alloc)}>
                                                    <span className="text-white font-abeezee text-xl block">
                                                        {formatCurrencyFull(alloc.initialValue)}
                                                    </span>
                                                    {alloc.isFinanced && alloc.totalValue && (
                                                        <span className="text-[#919191] text-base font-abeezee">
                                                            de {formatCurrencyFull(alloc.totalValue)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteAllocation(alloc);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-[#919191] hover:text-red-500 transition-all"
                                                    title="Excluir alocação"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <AddAllocationModal
                    allocation={editingAllocation}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAllocation}
                />
            )}
        </DashboardLayout>
    );
}
