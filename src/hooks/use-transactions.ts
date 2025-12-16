// ============================================
// Hook: useTransactions - CRUD de Transações
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Transaction, CreateTransactionPayload } from '@/types';

const QUERY_KEY = ['transactions'] as const;

export function useTransactions(clientId: string) {
    return useQuery<Transaction[]>({
        queryKey: [...QUERY_KEY, clientId],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/transactions`);
            return data;
        },
        enabled: !!clientId,
    });
}

export function useCreateTransaction(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateTransactionPayload) => {
            const { data } = await api.post(`/clients/${clientId}/transactions`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useUpdateTransaction(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<Transaction> & { id: string }) => {
            const { data } = await api.put(`/transactions/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useDeleteTransaction(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/transactions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}
