'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import AddInsuranceModal from '@/components/organisms/AddInsuranceModal';

interface Client {
    id: string;
    name: string;
}

interface Insurance {
    id: string;
    type: string;
    premium: number;
    coverage: number;
    startDate: string;
    endDate: string;
}

const insuranceTypeLabels: Record<string, string> = {
    life: 'Seguro de Vida',
    health: 'Seguro de Saúde',
    disability: 'Invalidez',
    property: 'Seguro Patrimonial',
    other: 'Outro',
};

export default function InsurancesPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<string>('');
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null);

    // Carregar clientes
    useEffect(() => {
        fetch('http://localhost:3333/api/clients')
            .then(res => res.json())
            .then(data => {
                setClients(data);
                if (data.length > 0) {
                    setSelectedClient(data[0].id);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Carregar seguros do cliente selecionado
    useEffect(() => {
        if (!selectedClient) return;

        setLoading(true);
        fetch(`http://localhost:3333/api/clients/${selectedClient}/insurances`)
            .then(res => res.json())
            .then(data => {
                setInsurances(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error('Erro ao carregar seguros:', err);
                setInsurances([]);
            })
            .finally(() => setLoading(false));
    }, [selectedClient]);

    const handleAddInsurance = () => {
        setEditingInsurance(null);
        setIsModalOpen(true);
    };

    const handleEditInsurance = (insurance: Insurance) => {
        setEditingInsurance(insurance);
        setIsModalOpen(true);
    };

    const handleDeleteInsurance = async (insuranceId: string) => {
        if (!confirm('Tem certeza que deseja excluir este seguro?')) return;

        try {
            const response = await fetch(`http://localhost:3333/api/insurances/${insuranceId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setInsurances(prev => prev.filter(i => i.id !== insuranceId));
            }
        } catch (error) {
            console.error('Erro ao excluir seguro:', error);
        }
    };

    const handleSaveInsurance = (insurance: { id?: string; type: string; premium: number; coverage: number; startDate: string; endDate: string }) => {
        if (!insurance.id) return; // API deve retornar um ID

        const insuranceWithId: Insurance = { ...insurance, id: insurance.id };

        if (editingInsurance) {
            setInsurances(prev => prev.map(i => i.id === insuranceWithId.id ? insuranceWithId : i));
        } else {
            setInsurances(prev => [...prev, insuranceWithId]);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="min-h-screen bg-[#101010] flex">
            <Sidebar />
            <div className="flex-1 ml-[72px]">
                <Header />
                <main className="container-main py-8">
                    {/* Seletor de Cliente */}
                    <div className="mb-8">
                        <label className="block text-sm text-gray-400 mb-2">Selecione o Cliente</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white min-w-[200px] focus:outline-none focus:border-[#4ADE80]"
                        >
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Header da seção */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Seguros</h1>
                            <p className="text-gray-400 mt-1">Gerencie os seguros do cliente</p>
                        </div>
                        <button
                            onClick={handleAddInsurance}
                            className="flex items-center gap-2 bg-[#4ADE80] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#3BC96D] transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Adicionar Seguro
                        </button>
                    </div>

                    {/* Lista de Seguros */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4ADE80]"></div>
                        </div>
                    ) : insurances.length === 0 ? (
                        <div className="bg-[#1A1A1A] rounded-2xl p-12 text-center border border-[#2F2F2F]">
                            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-gray-400 text-lg mb-2">Nenhum seguro cadastrado</p>
                            <p className="text-gray-500 text-sm">Adicione seguros para proteger o patrimônio do cliente</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {insurances.map(insurance => (
                                <div
                                    key={insurance.id}
                                    className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2F2F2F] hover:border-[#3F3F3F] transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#4ADE80]/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-[#4ADE80]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-white font-medium">
                                                    {insuranceTypeLabels[insurance.type] || insurance.type}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {formatDate(insurance.startDate)} - {formatDate(insurance.endDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Prêmio Mensal</p>
                                                <p className="text-white font-medium">{formatCurrency(insurance.premium)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400">Cobertura</p>
                                                <p className="text-[#4ADE80] font-medium">{formatCurrency(insurance.coverage)}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditInsurance(insurance)}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    title="Editar"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInsurance(insurance.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Excluir"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Resumo */}
                    {insurances.length > 0 && (
                        <div className="mt-8 bg-[#1A1A1A] rounded-xl p-6 border border-[#2F2F2F]">
                            <h3 className="text-white font-medium mb-4">Resumo de Proteção</h3>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-gray-400 text-sm">Total de Seguros</p>
                                    <p className="text-2xl font-semibold text-white">{insurances.length}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Custo Mensal Total</p>
                                    <p className="text-2xl font-semibold text-orange-400">
                                        {formatCurrency(insurances.reduce((acc, i) => acc + i.premium, 0))}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Cobertura Total</p>
                                    <p className="text-2xl font-semibold text-[#4ADE80]">
                                        {formatCurrency(insurances.reduce((acc, i) => acc + i.coverage, 0))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <AddInsuranceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveInsurance}
                insurance={editingInsurance}
                clientId={selectedClient}
            />
        </div>
    );
}
