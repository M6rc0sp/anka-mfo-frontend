'use client';

import { useState, useEffect } from 'react';

interface Insurance {
    id?: string;
    type: string;
    premium: number;
    coverage: number;
    startDate: string;
    endDate: string;
}

interface AddInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (insurance: Insurance) => void;
    insurance?: Insurance | null;
    clientId: string;
}

const insuranceTypes = [
    { value: 'life', label: 'Seguro de Vida' },
    { value: 'health', label: 'Seguro de Saúde' },
    { value: 'disability', label: 'Invalidez' },
    { value: 'property', label: 'Seguro Patrimonial' },
    { value: 'other', label: 'Outro' },
];

export default function AddInsuranceModal({
    isOpen,
    onClose,
    onSave,
    insurance,
    clientId,
}: AddInsuranceModalProps) {
    const [formData, setFormData] = useState<Insurance>({
        type: 'life',
        premium: 0,
        coverage: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (insurance) {
            setFormData({
                ...insurance,
                startDate: insurance.startDate?.split('T')[0] || '',
                endDate: insurance.endDate?.split('T')[0] || '',
            });
        } else {
            setFormData({
                type: 'life',
                premium: 0,
                coverage: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
            });
        }
    }, [insurance, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = insurance?.id
                ? `http://localhost:3333/api/insurances/${insurance.id}`
                : `http://localhost:3333/api/clients/${clientId}/insurances`;

            const method = insurance?.id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar seguro');
            }

            const savedInsurance = await response.json();
            onSave(savedInsurance);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1A1A1A] rounded-2xl w-full max-w-md p-6 border border-[#2F2F2F]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {insurance?.id ? 'Editar Seguro' : 'Novo Seguro'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Tipo de Seguro</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-[#252525] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                        >
                            {insuranceTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Prêmio Mensal</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="number"
                                name="premium"
                                value={formData.premium}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full bg-[#252525] border border-[#2F2F2F] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                                placeholder="0,00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Valor mensal: {formatCurrency(formData.premium)}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Cobertura</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
                            <input
                                type="number"
                                name="coverage"
                                value={formData.coverage}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className="w-full bg-[#252525] border border-[#2F2F2F] rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                                placeholder="0,00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Cobertura total: {formatCurrency(formData.coverage)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Data de Início</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full bg-[#252525] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Data de Término</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full bg-[#252525] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#4ADE80] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-[#2F2F2F] rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-[#4ADE80] text-black rounded-lg font-medium hover:bg-[#3BC96D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
