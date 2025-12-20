import React from 'react';

interface Simulation {
    id?: string;
    name: string;
    description: string;
    status: string;
    initialCapital: number;
    monthlyContribution: number;
    inflationRate: number;
    yearsProjection: number;
}

interface AddSimulationModalProps {
    simulation: Simulation | null;
    onClose: () => void;
    onSave: (data: Partial<Simulation>) => void;
}

export default function AddSimulationModal({ simulation, onClose, onSave }: AddSimulationModalProps) {
    const [formData, setFormData] = React.useState({
        name: simulation?.name || '',
        description: simulation?.description || '',
        status: simulation?.status || 'rascunho',
        initialCapital: simulation?.initialCapital || 100000,
        monthlyContribution: simulation?.monthlyContribution || 2000,
        inflationRate: simulation?.inflationRate || 3.5,
        yearsProjection: simulation?.yearsProjection || 20,
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: ['name', 'description', 'status'].includes(name) ? value : Number(value),
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        if (formData.initialCapital < 0) {
            newErrors.initialCapital = 'Capital inicial não pode ser negativo';
        }
        if (formData.monthlyContribution < 0) {
            newErrors.monthlyContribution = 'Aporte mensal não pode ser negativo';
        }
        if (formData.yearsProjection < 1 || formData.yearsProjection > 100) {
            newErrors.yearsProjection = 'Anos de projeção deve estar entre 1 e 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await onSave(formData);
        } finally {
            setLoading(false);
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
            <div className="relative bg-[#141614] border border-[#333] rounded-xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        {simulation ? 'Editar Simulação' : 'Nova Simulação'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-[#333] rounded transition-colors"
                    >
                        <svg className="w-5 h-5 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Nome da Simulação *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: Projeção Conservadora"
                            className={`w-full bg-[#1D1F1E] border ${errors.name ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descreva a simulação..."
                            rows={3}
                            className="w-full bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors"
                        >
                            <option value="rascunho">Rascunho</option>
                            <option value="ativa">Ativa</option>
                            <option value="arquivada">Arquivada</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Initial Capital */}
                        <div>
                            <label className="block text-sm text-[#C9C9C9] mb-1">Capital Inicial (R$)</label>
                            <input
                                type="number"
                                name="initialCapital"
                                value={formData.initialCapital}
                                onChange={handleChange}
                                min="0"
                                step="1000"
                                className={`w-full bg-[#1D1F1E] border ${errors.initialCapital ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors`}
                            />
                            {errors.initialCapital && (
                                <p className="text-red-500 text-xs mt-1">{errors.initialCapital}</p>
                            )}
                        </div>

                        {/* Monthly Contribution */}
                        <div>
                            <label className="block text-sm text-[#C9C9C9] mb-1">Aporte Mensal (R$)</label>
                            <input
                                type="number"
                                name="monthlyContribution"
                                value={formData.monthlyContribution}
                                onChange={handleChange}
                                min="0"
                                step="100"
                                className={`w-full bg-[#1D1F1E] border ${errors.monthlyContribution ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors`}
                            />
                            {errors.monthlyContribution && (
                                <p className="text-red-500 text-xs mt-1">{errors.monthlyContribution}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Inflation Rate */}
                        <div>
                            <label className="block text-sm text-[#C9C9C9] mb-1">Inflação (% a.a.)</label>
                            <input
                                type="number"
                                name="inflationRate"
                                value={formData.inflationRate}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="0.1"
                                className="w-full bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Years Projection */}
                        <div>
                            <label className="block text-sm text-[#C9C9C9] mb-1">Anos de Projeção</label>
                            <input
                                type="number"
                                name="yearsProjection"
                                value={formData.yearsProjection}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                className={`w-full bg-[#1D1F1E] border ${errors.yearsProjection ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors`}
                            />
                            {errors.yearsProjection && (
                                <p className="text-red-500 text-xs mt-1">{errors.yearsProjection}</p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-[#C9C9C9] hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#F5A623] hover:bg-[#E09000] disabled:bg-[#333] text-black font-semibold rounded-lg transition-colors"
                        >
                            {loading ? 'Salvando...' : (simulation ? 'Salvar' : 'Criar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
