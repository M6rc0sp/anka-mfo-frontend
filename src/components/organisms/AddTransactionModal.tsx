'use client';

import React from 'react';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    transactionDate: string;
}

interface AddTransactionModalProps {
    transaction: Transaction | null;
    onClose: () => void;
    onSave: (data: Partial<Transaction>) => void;
}

export default function AddTransactionModal({ transaction, onClose, onSave }: AddTransactionModalProps) {
    const [formData, setFormData] = React.useState({
        type: transaction?.type || 'aporte',
        description: transaction?.description || '',
        amount: transaction?.amount?.toString() || '',
        transactionDate: transaction?.transactionDate
            ? new Date(transaction.transactionDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
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

        const amount = parseFloat(formData.amount) || 0;
        if (amount <= 0) {
            newErrors.amount = 'Valor deve ser maior que zero';
        }

        if (!formData.transactionDate) {
            newErrors.transactionDate = 'Data é obrigatória';
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
                amount: parseFloat(formData.amount) || 0,
                transactionDate: new Date(formData.transactionDate).toISOString(),
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

    // Cores por tipo de transação
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'aporte':
                return 'text-[#48F7A1]';
            case 'resgate':
                return 'text-[#FF5151]';
            case 'rendimento':
                return 'text-[#67AEFA]';
            case 'taxa':
                return 'text-[#F7B748]';
            default:
                return 'text-white';
        }
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
                        {transaction ? 'Editar Transação' : 'Nova Transação'}
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
                                className={`w-full bg-[#1D1F1E] border border-[#C1C1C1] rounded-[15px] px-4 py-3 focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee appearance-none cursor-pointer ${getTypeColor(formData.type)}`}
                            >
                                <option value="aporte" className="text-[#48F7A1]">Aporte</option>
                                <option value="resgate" className="text-[#FF5151]">Resgate</option>
                                <option value="rendimento" className="text-[#67AEFA]">Rendimento</option>
                                <option value="taxa" className="text-[#F7B748]">Taxa</option>
                            </select>
                        </div>

                        {/* Transaction Date */}
                        <div>
                            <label className="block text-sm text-[#919191] mb-2 font-abeezee">Data</label>
                            <input
                                type="date"
                                name="transactionDate"
                                value={formData.transactionDate}
                                onChange={handleTextChange}
                                className={`w-full bg-[#1D1F1E] border ${errors.transactionDate ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] px-4 py-3 text-white focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee cursor-pointer`}
                            />
                            {errors.transactionDate && (
                                <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.transactionDate}</p>
                            )}
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
                            placeholder="Ex: Aporte mensal"
                            className={`w-full bg-[#1D1F1E] border ${errors.description ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] px-4 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-inter`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.description}</p>
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm text-[#919191] mb-2 font-abeezee">Valor</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#919191] font-abeezee">R$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                name="amount"
                                value={formData.amount}
                                onChange={handleNumberChange}
                                placeholder="10.000"
                                className={`w-full bg-[#1D1F1E] border ${errors.amount ? 'border-red-500' : 'border-[#C1C1C1]'} rounded-[15px] pl-12 pr-4 py-3 text-white placeholder-[#757575] focus:border-[#FF9343] focus:outline-none transition-colors font-abeezee`}
                            />
                        </div>
                        {formData.amount && (
                            <p className="text-[#919191] text-xs mt-1 font-abeezee">
                                {formatCurrencyDisplay(formData.amount)}
                            </p>
                        )}
                        {errors.amount && (
                            <p className="text-red-500 text-xs mt-1 font-abeezee">{errors.amount}</p>
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
                            {loading ? 'Salvando...' : (transaction ? 'Salvar' : 'Criar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
