interface Transaction {
    id: string;
    type: string;
    amount: number;
    description: string;
    transactionDate: string;
}

interface TransactionRowProps {
    transaction: Transaction;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
    const typeConfig: Record<string, { label: string; color: string; isNegative: boolean }> = {
        'aporte': { label: 'Aporte', color: '#4ADE80', isNegative: false },
        'resgate': { label: 'Resgate', color: '#EF4444', isNegative: true },
        'rendimento': { label: 'Rendimento', color: '#5B8DEF', isNegative: false },
        'taxa': { label: 'Taxa', color: '#F5A623', isNegative: true },
    };

    const config = typeConfig[transaction.type] || { label: transaction.type, color: '#757575', isNegative: false };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <tr className="border-b border-[#333] hover:bg-[#1D1F1E] transition-colors group">
            <td className="px-4 py-3 text-white">
                {formatDate(transaction.transactionDate)}
            </td>
            <td className="px-4 py-3">
                <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                    {config.label}
                </span>
            </td>
            <td className="px-4 py-3 text-[#C9C9C9]">
                {transaction.description}
            </td>
            <td className={`px-4 py-3 text-right font-semibold ${config.isNegative ? 'text-red-500' : 'text-green-500'}`}>
                {config.isNegative ? '-' : '+'}{formatCurrency(transaction.amount)}
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </td>
        </tr>
    );
}
