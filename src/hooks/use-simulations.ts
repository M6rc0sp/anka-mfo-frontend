// ============================================
// Hook: useSimulations - CRUD de Simulações
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import {
    Simulation,
    SimulationVersion,
    CreateSimulationPayload,
    ProjectionResult,
} from '@/types';

const QUERY_KEY = ['simulations'] as const;

export function useSimulations(clientId: string) {
    return useQuery<Simulation[]>({
        queryKey: [...QUERY_KEY, clientId],
        queryFn: async () => {
            const { data } = await api.get(`/clients/${clientId}/simulations`);
            return data;
        },
        enabled: !!clientId,
    });
}

export function useSimulation(id: string) {
    return useQuery<Simulation>({
        queryKey: [...QUERY_KEY, 'detail', id],
        queryFn: async () => {
            const { data } = await api.get(`/simulations/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useSimulationVersions(simulationId: string) {
    return useQuery<SimulationVersion[]>({
        queryKey: [...QUERY_KEY, simulationId, 'versions'],
        queryFn: async () => {
            const { data } = await api.get(`/simulations/${simulationId}/versions`);
            return data;
        },
        enabled: !!simulationId,
    });
}

export function useProjection(simulationId: string, years = 30) {
    return useQuery<ProjectionResult>({
        queryKey: [...QUERY_KEY, simulationId, 'projection', years],
        queryFn: async () => {
            const { data } = await api.get(`/simulations/${simulationId}/projection`, {
                params: { years },
            });
            return data;
        },
        enabled: !!simulationId,
    });
}

export function useCreateSimulation(clientId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateSimulationPayload) => {
            const { data } = await api.post(`/clients/${clientId}/simulations`, payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, clientId] });
        },
    });
}

export function useUpdateSimulation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...payload }: Partial<Simulation> & { id: string }) => {
            const { data } = await api.put(`/simulations/${id}`, payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, 'detail', data.id] });
        },
    });
}

export function useDeleteSimulation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/simulations/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY });
        },
    });
}

export function useCreateSimulationVersion(simulationId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post(`/simulations/${simulationId}/versions`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, simulationId, 'versions'] });
        },
    });
}

export function useCompareSimulations(clientId: string) {
    return useMutation({
        mutationFn: async (simulationIds: string[]) => {
            const { data } = await api.post(`/clients/${clientId}/compare`, { simulationIds });
            return data;
        },
    });
}
