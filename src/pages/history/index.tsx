import React from 'react';
import DashboardLayout from '@/components/templates/DashboardLayout';
import Header from '@/components/organisms/Header';
import TransactionRow from '@/components/organisms/TransactionRow';
import AddTransactionModal from '@/components/organisms/AddTransactionModal';

interface Client {
    id: string;
    name: string;
}

interface Simulation {
    id: string;
    name: string;
}

interface Allocation {
    id: string;
    description: string;
}

interface Transaction {
    id: string;
    allocationId: string;
    type: string;
    amount: number;
    description: string;
    transactionDate: string;
}

export default function HistoryPage() {
    const [clients, setClients] = React.useState<Client[]>([]);
    const [simulations, setSimulations] = React.useState<Simulation[]>([]);
    const [allocations, setAllocations] = React.useState<Allocation[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [selectedClient, setSelectedClient] = React.useState<string>('');
    const [selectedSimulation, setSelectedSimulation] = React.useState<string>('');
    const [selectedAllocation, setSelectedAllocation] = React.useState<string>('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingTransaction, setEditingTransaction] = React.useState<Transaction | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [filterType, setFilterType] = React.useState<string>('');

    // Fetch clients
    React.useEffect(() => {
        fetch('http://localhost:3333/clients')
            .then(res => res.json())
            .then(data => {
                const clientList = data.success ? data.data : data;
                setClients(Array.isArray(clientList) ? clientList : []);
            })
            .catch(console.error);
    }, []);

    // Fetch simulations when client changes
    React.useEffect(() => {
        if (!selectedClient) {
            setSimulations([]);
            setAllocations([]);
            setTransactions([]);
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
            setTransactions([]);
            return;
        }

        fetch(`http://localhost:3333/simulations/${selectedSimulation}/allocations`)
            .then(res => res.json())
            .then(data => {
                const allocList = data.success ? data.data : data;
                setAllocations(Array.isArray(allocList) ? allocList : []);
            })
            .catch(console.error);
    }, [selectedSimulation]);

    // Fetch transactions when allocation changes
    React.useEffect(() => {
        if (!selectedAllocation) {
            setTransactions([]);
            return;
        }

        setLoading(true);
        fetch(`http://localhost:3333/allocations/${selectedAllocation}/transactions`)
            .then(res => res.json())
            .then(data => {
                const txList = data.success ? data.data : data;
                setTransactions(Array.isArray(txList) ? txList : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [selectedAllocation]);

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleEditTransaction = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return;

        try {
            await fetch(`http://localhost:3333/transactions/${id}`, { method: 'DELETE' });
            setTransactions(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleSaveTransaction = async (data: Partial<Transaction>) => {
        try {
            if (editingTransaction) {
                // Update
                const res = await fetch(`http://localhost:3333/transactions/${editingTransaction.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await res.json();
                const updated = result.success ? result.data : result;
                setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? updated : t));
            } else {
                // Create
                const res = await fetch(`http://localhost:3333/transactions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, allocationId: selectedAllocation }),
                });
                const result = await res.json();
                const created = result.success ? result.data : result;
                setTransactions(prev => [...prev, created]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    // Filter transactions
    const filteredTransactions = filterType
        ? transactions.filter(t => t.type === filterType)
        : transactions;

    // Calculate totals
    const totalEntries = transactions
        .filter(t => t.type === 'aporte' || t.type === 'rendimento')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExits = transactions
        .filter(t => t.type === 'resgate' || t.type === 'taxa')
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <DashboardLayout activeMenuItem="clientes">
            <Header activeTab="historico" />

            <main className="container-main py-8">
                {/* Filters */}
                <div className="flex flex-wrap items-end gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#757575]">Cliente</label>
                        <select
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                            className="bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2 text-white min-w-[180px]"
                        >
                            <option value="">Selecione um cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#757575]">Simulação</label>
                        <select
                            value={selectedSimulation}
                            onChange={(e) => setSelectedSimulation(e.target.value)}
                            className="bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2 text-white min-w-[180px]"
                            disabled={!selectedClient}
                        >
                            <option value="">Selecione</option>
                            {simulations.map(sim => (
                                <option key={sim.id} value={sim.id}>{sim.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#757575]">Alocação</label>
                        <select
                            value={selectedAllocation}
                            onChange={(e) => setSelectedAllocation(e.target.value)}
                            className="bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2 text-white min-w-[180px]"
                            disabled={!selectedSimulation}
                        >
                            <option value="">Selecione</option>
                            {allocations.map(alloc => (
                                <option key={alloc.id} value={alloc.id}>{alloc.description}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-[#757575]">Tipo</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-[#1D1F1E] border border-[#333] rounded-lg px-4 py-2 text-white min-w-[140px]"
                        >
                            <option value="">Todos</option>
                            <option value="aporte">Aporte</option>
                            <option value="resgate">Resgate</option>
                            <option value="rendimento">Rendimento</option>
                            <option value="taxa">Taxa</option>
                        </select>
                    </div>

                    <div className="ml-auto">
                        <button
                            onClick={handleAddTransaction}
                            disabled={!selectedAllocation}
                            className="bg-[#F5A623] hover:bg-[#E09000] disabled:bg-[#333] disabled:cursor-not-allowed text-black font-semibold px-6 py-2 rounded-lg transition-colors"
                        >
                            + Nova Transação
                        </button>
                    </div>
                </div>

                {/* Summary */}
                {transactions.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="wrapper-neutral p-4">
                            <div className="text-sm text-[#757575]">Total Entradas</div>
                            <div className="text-2xl font-semibold text-green-500">
                                +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEntries)}
                            </div>
                        </div>
                        <div className="wrapper-neutral p-4">
                            <div className="text-sm text-[#757575]">Total Saídas</div>
                            <div className="text-2xl font-semibold text-red-500">
                                -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExits)}
                            </div>
                        </div>
                        <div className="wrapper-neutral p-4">
                            <div className="text-sm text-[#757575]">Saldo</div>
                            <div className={`text-2xl font-semibold ${totalEntries - totalExits >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEntries - totalExits)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions Table */}
                <div className="wrapper-neutral overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#333]">
                                <th className="text-left text-sm text-[#757575] font-medium px-4 py-3">Data</th>
                                <th className="text-left text-sm text-[#757575] font-medium px-4 py-3">Tipo</th>
                                <th className="text-left text-sm text-[#757575] font-medium px-4 py-3">Descrição</th>
                                <th className="text-right text-sm text-[#757575] font-medium px-4 py-3">Valor</th>
                                <th className="text-right text-sm text-[#757575] font-medium px-4 py-3 w-20">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-[#757575]">
                                        Carregando transações...
                                    </td>
                                </tr>
                            )}

                            {!loading && filteredTransactions.length === 0 && selectedAllocation && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-[#757575]">
                                        Nenhuma transação encontrada.
                                    </td>
                                </tr>
                            )}

                            {!loading && !selectedAllocation && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-[#757575]">
                                        Selecione um cliente, simulação e alocação para ver o histórico.
                                    </td>
                                </tr>
                            )}

                            {filteredTransactions.map(transaction => (
                                <TransactionRow
                                    key={transaction.id}
                                    transaction={transaction}
                                    onEdit={() => handleEditTransaction(transaction)}
                                    onDelete={() => handleDeleteTransaction(transaction.id)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <AddTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveTransaction}
                />
            )}
        </DashboardLayout>
    );
}
