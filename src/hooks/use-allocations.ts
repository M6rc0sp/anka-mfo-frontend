// ============================================
// Hook: useAllocations - CRUD de Alocações
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Allocation, CreateAllocationPayload } from '@/types';

const QUERY_KEY = ['allocations'] as const;

export function useAllocations(clientId: string) {
    return useQuery<Allocation[]>({
        queryKey: [...QUERY_KEY, clientId],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/allocations`);
            return data;
        },
        enabled: !!clientId,
    });
}

export function useAllocationsByDate(clientId: string, date: string) {
    return useQuery<Allocation[]>({
        queryKey: [...QUERY_KEY, clientId, date],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/allocations/${date}`);
            return data;
        },
        enabled: !!clientId && !!date,
    });
}

export function useAllocationDates(clientId: string) {
    return useQuery<string[]>({
        queryKey: [...QUERY_KEY, clientId, 'dates'],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/allocations/dates`);
            return data;
        },
        enabled: !!clientId,
    });
}

export function useCreateAllocation(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateAllocationPayload) => {
            const { data } = await api.post(`/clients/${clientId}/allocations`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useUpdateAllocation(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<Allocation> & { id: string }) => {
            const { data } = await api.put(`/allocations/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useDeleteAllocation(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/allocations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useCopyAllocations(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ fromDate, toDate }: { fromDate: string; toDate: string }) => {
            const { data } = await api.post(`/clients/${clientId}/allocations/copy`, {
                fromDate,
                toDate,
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId, 'dates'] });
        },
    });
}
