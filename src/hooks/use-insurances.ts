// ============================================
// Hook: useInsurances - CRUD de Seguros
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Insurance, CreateInsurancePayload } from '@/types';

const QUERY_KEY = ['insurances'] as const;

export function useInsurances(clientId: string) {
    return useQuery<Insurance[]>({
        queryKey: [...QUERY_KEY, clientId],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/insurances`);
            return data;
        },
        enabled: !!clientId,
    });
}

export function useCreateInsurance(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateInsurancePayload) => {
            const { data } = await api.post(`/clients/${clientId}/insurances`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useUpdateInsurance(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<Insurance> & { id: string }) => {
            const { data } = await api.put(`/insurances/${id}`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useDeleteInsurance(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/insurances/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}
