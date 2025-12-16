// ============================================
// Hook: useClients - CRUD de Clientes
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Client, CreateClientPayload } from '@/types';

const QUERY_KEY = ['clients'] as const;

export function useClients() {
    return useQuery<Client[]>({
        queryKey: QUERY_KEY,
        queryFn: async () => {
            const { data } = await api.get('/clients');
            return data;
        },
    });
}

export function useClient(id: string) {
    return useQuery<Client>({
        queryKey: [...QUERY_KEY, id],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateClientPayload) => {
            const { data } = await api.post('/clients', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<Client> & { id: string }) => {
            const { data } = await api.put(`/clients/${id}`, payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, data.id] });
        },
    });
}

export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/clients/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}
