import React from 'react';

interface Client {
    id?: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    birthdate: string;
    status: string;
}

interface AddClientModalProps {
    client: Client | null;
    onClose: () => void;
    onSave: (data: Partial<Client>) => void;
}

export default function AddClientModal({ client, onClose, onSave }: AddClientModalProps) {
    const [formData, setFormData] = React.useState({
        name: client?.name || '',
        email: client?.email || '',
        cpf: client?.cpf || '',
        phone: client?.phone || '',
        birthdate: client?.birthdate
            ? new Date(client.birthdate).toISOString().split('T')[0]
            : '',
        status: client?.status || 'vivo',
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
            newErrors.cpf = 'CPF deve ter 11 dígitos';
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
                ...formData,
                cpf: formData.cpf.replace(/\D/g, ''),
                phone: formData.phone.replace(/\D/g, ''),
                birthdate: formData.birthdate || undefined,
            });
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
                        {client ? 'Editar Cliente' : 'Novo Cliente'}
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
                        <label className="block text-sm text-[#C9C9C9] mb-1">Nome Completo *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ex: João Silva"
                            className={`w-full bg-[#1D1F1E] border ${errors.name ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@exemplo.com"
                            className={`w-full bg-[#1D1F1E] border ${errors.email ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* CPF */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">CPF *</label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            placeholder="00000000000"
                            maxLength={14}
                            className={`w-full bg-[#1D1F1E] border ${errors.cpf ? 'border-red-500' : 'border-[#333]'} rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors`}
                        />
                        {errors.cpf && (
                            <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Telefone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="11999999999"
                            className="w-full bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2.5 text-white placeholder-[#757575] focus:border-[#F5A623] focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="block text-sm text-[#C9C9C9] mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            className="w-full bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:border-[#F5A623] focus:outline-none transition-colors"
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
                            <option value="vivo">Vivo</option>
                            <option value="falecido">Falecido</option>
                            <option value="incapacidade">Incapacidade</option>
                        </select>
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
                            {loading ? 'Salvando...' : (client ? 'Salvar' : 'Criar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
