'use client';

import React from 'react';

interface Allocation {
    id: string;
    type: string;
    description: string;
    percentage: number;
    initialValue: number;
    annualReturn: number;
    allocationDate?: string;
}

interface AddAllocationModalProps {
    allocation: Allocation | null;
    onClose: () => void;
    onSave: (data: Partial<Allocation>) => void;
}

export default function AddAllocationModal({ allocation, onClose, onSave }: AddAllocationModalProps) {
    const [formData, setFormData] = React.useState({
        type: allocation?.type || 'financeira',
        description: allocation?.description || '',
        percentage: allocation?.percentage?.toString() || '',
        initialValue: allocation?.initialValue?.toString() || '',
        annualReturn: allocation?.annualReturn?.toString() || '',
        allocationDate: allocation?.allocationDate || new Date().toISOString().split('T')[0],
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);

    // Handler para campos de texto
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handler para campos numéricos - permite string vazia e números
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Permite apenas números, ponto e vírgula
        const cleanValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
        setFormData(prev => ({ ...prev, [name]: cleanValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Descrição é obrigatória';
        }

        const percentage = parseFloat(formData.percentage) || 0;
        if (percentage <= 0 || percentage > 100) {
            newErrors.percentage = 'Percentual deve estar entre 0 e 100';
        }

        const initialValue = parseFloat(formData.initialValue) || 0;
        if (initialValue < 0) {
            newErrors.initialValue = 'Valor inicial não pode ser negativo';
        }

        const annualReturn = parseFloat(formData.annualReturn) || 0;
        if (annualReturn < -100) {
            newErrors.annualReturn = 'Retorno anual inválido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSave({
                type: formData.type,
                description: formData.description,
                percentage: parseFloat(formData.percentage) || 0,
                initialValue: parseFloat(formData.initialValue) || 0,
                annualReturn: parseFloat(formData.annualReturn) || 0,
                allocationDate: formData.allocationDate,
            });
        } finally {
            setLoading(false);
        }
    };

    // Formatar valor para exibição em BRL
    const formatCurrencyDisplay = (value: string) => {
        const num = parseFloat(value) || 0;
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#101010] border-2 border-[#C9C9C9] rounded-[25px] w-full max-w-md p-6 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white font-abeezee">
                        {allocation ? 'Editar Alocação' : 'Nova Alocação'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#1D1F1E] rounded-full transition-colors text-[#919191] hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type and Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Type */}
                        <div>
                            <label className="block text-sm text-[#919191] mb-2 font-abeezee">Tipo</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleTextChange}
                                className="w-full bg-[#1D1F1E] border border-[#C1C1C1] rounded-[15px] px-4 py-3 text-white focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee appearance-none cursor-pointer"
                            >
                                <option value="financeira">Financeira</option>
                                <option value="imovel">Imóvel</option>
                            </select>
                        </div>

                        {/* Allocation Date */}
                        <div>
                            <label className="block text-sm text-[#919191] mb-2 font-abeezee">Data da Alocação</label>
                            <input
                                type="date"
                                name="allocationDate"
                                value={formData.allocationDate}
                                onChange={handleTextChange}
                                className="w-full bg-[#1D1F1E] border border-[#C1C1C1] rounded-[15px] px-4 py-3 text-white focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-[#919191] mb-2 font-abeezee">Descrição</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleTextChange}
                            placeholder="Ex: CDB Banco C6"
                            className={`w-full bg-[#1D1F1E] border ${errors.description ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] px-4 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-inter`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.description}</p>
                        )}
                    </div>

                    {/* Initial Value */}
                    <div>
                        <label className="block text-sm text-[#919191] mb-2 font-abeezee">Valor Inicial</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919191] font-abeezee">R$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                name="initialValue"
                                value={formData.initialValue}
                                onChange={handleNumberChange}
                                placeholder="1.000.000"
                                className={`w-full bg-[#1D1F1E] border ${errors.initialValue ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] pl-12 pr-4 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee`}
                            />
                        </div>
                        {formData.initialValue && (
                            <p className="text-[#919191] text-xs mt-1 font-abeezee">
                                {formatCurrencyDisplay(formData.initialValue)}
                            </p>
                        )}
                        {errors.initialValue && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.initialValue}</p>
                        )}
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="block text-sm text-[#919191] mb-2 font-abeezee">Percentual da Carteira</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                name="percentage"
                                value={formData.percentage}
                                onChange={handleNumberChange}
                                placeholder="25"
                                className={`w-full bg-[#1D1F1E] border ${errors.percentage ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] px-4 pr-10 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#919191] font-abeezee">%</span>
                        </div>
                        {errors.percentage && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.percentage}</p>
                        )}
                    </div>

                    {/* Annual Return */}
                    <div>
                        <label className="block text-sm text-[#919191] mb-2 font-abeezee">Retorno Anual Esperado</label>
                        <div className="relative">
                            <input
                                type="text"
                                inputMode="decimal"
                                name="annualReturn"
                                value={formData.annualReturn}
                                onChange={handleNumberChange}
                                placeholder="12.5"
                                className={`w-full bg-[#1D1F1E] border ${errors.annualReturn ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] px-4 pr-16 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#919191] font-abeezee">% a.a.</span>
                        </div>
                        {errors.annualReturn && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.annualReturn}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-[#C1C1C1] text-[#C9C9C9] hover:text-white hover:border-white rounded-full transition-colors font-abeezee"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-[#FF9343] hover:bg-[#E08030] disabled:bg-[#333] text-white font-semibold rounded-full transition-colors font-abeezee"
                        >
                            {loading ? 'Salvando...' : (allocation ? 'Salvar' : 'Criar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
