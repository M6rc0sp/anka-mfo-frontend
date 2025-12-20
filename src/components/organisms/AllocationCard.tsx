interface Allocation {
    id: string;
    type: string;
    description: string;
    percentage: number;
    initialValue: number;
    annualReturn: number;
}

interface AllocationCardProps {
    allocation: Allocation;
    onEdit: () => void;
    onDelete: () => void;
}

export default function AllocationCard({ allocation, onEdit, onDelete }: AllocationCardProps) {
    const typeColors: Record<string, string> = {
        'financeira': '#5B8DEF',
        'imovel': '#4ADE80',
        'financial': '#5B8DEF',
        'property': '#4ADE80',
    };

    const typeLabels: Record<string, string> = {
        'financeira': 'Financeira',
        'imovel': 'Imóvel',
        'financial': 'Financeira',
        'property': 'Imóvel',
    };

    const color = typeColors[allocation.type] || '#F5A623';
    const typeLabel = typeLabels[allocation.type] || allocation.type;

    return (
        <div className="wrapper-neutral p-4 relative group">
            {/* Type indicator */}
            <div
                className="absolute top-0 left-0 w-1 h-full rounded-l-lg"
                style={{ backgroundColor: color }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${color}20`, color }}
                    >
                        {typeLabel}
                    </span>
                    <h3 className="text-white font-medium mt-2">{allocation.description}</h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-1.5 hover:bg-[#333] rounded transition-colors"
                        title="Editar"
                    >
                        <svg className="w-4 h-4 text-[#757575]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 hover:bg-[#333] rounded transition-colors"
                        title="Excluir"
                    >
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <div className="text-xs text-[#757575]">Valor Inicial</div>
                    <div className="text-white font-semibold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(allocation.initialValue)}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-[#757575]">Percentual</div>
                    <div className="text-white font-semibold">{allocation.percentage}%</div>
                </div>
                <div className="col-span-2">
                    <div className="text-xs text-[#757575]">Retorno Anual</div>
                    <div className="text-green-500 font-semibold">+{allocation.annualReturn}% a.a.</div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
                <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${Math.min(allocation.percentage, 100)}%`,
                            backgroundColor: color
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
