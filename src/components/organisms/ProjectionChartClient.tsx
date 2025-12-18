"use client";
import React from 'react';
import ProjectionChart from './ProjectionChart';

interface ProjectionChartClientProps {
    selectedClient?: string | undefined;
}

export default function ProjectionChartClient({ selectedClient }: ProjectionChartClientProps) {
    const [loading, setLoading] = React.useState(false);
    const [series, setSeries] = React.useState<any[]>([]);

    React.useEffect(() => {
        let mounted = true;
        const fetchProjectionForClient = async (clientId?: string) => {
            if (!clientId) {
                if (mounted) setSeries([]);
                return;
            }

            setLoading(true);
            try {
                console.log('Fetching projection for client:', clientId);
                // 1) fetch simulations for client
                const simsUrl = `http://localhost:3333/clients/${clientId}/simulations`;
                const simsRes = await fetch(simsUrl);
                if (!simsRes.ok) throw new Error(`Failed to fetch simulations: ${simsRes.status}`);
                const simsBody = await simsRes.json();
                const sims = simsBody.success && Array.isArray(simsBody.data) ? simsBody.data : (Array.isArray(simsBody) ? simsBody : []);
                const sim = sims[0];

                if (!sim || !sim.id) {
                    console.warn('No simulation found for client');
                    if (mounted) setSeries([]);
                    return;
                }

                // 2) fetch projection for simulation
                const projUrl = `http://localhost:3333/simulations/${sim.id}/projection`;
                const projRes = await fetch(projUrl);
                if (!projRes.ok) throw new Error(`Failed to fetch projection: ${projRes.status}`);
                const projBody = await projRes.json();
                const proj = projBody.success ? projBody.data : projBody;

                // map yearly to series
                const yearly = Array.isArray(proj.yearly) ? proj.yearly : [];
                const s = yearly.map((y: any) => ({ x: y.year, y: y.totalAssets }));

                if (mounted) {
                    setSeries([{ name: 'Projeção', data: s }]);
                }
            } catch (err) {
                console.error('Error in fetchProjectionForClient:', err);
                if (mounted) setSeries([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchProjectionForClient(selectedClient);
        return () => { mounted = false; };
    }, [selectedClient]);

    return (
        <div className="h-full">
            {loading && <div className="text-[#C9C9C9]">Carregando projeção...</div>}
            {!loading && series.length > 0 && <ProjectionChart series={series} />}
            {!loading && series.length === 0 && (
                <div className="h-full flex items-center justify-center text-[#757575] font-work-sans">
                    Nenhuma projeção disponível para este cliente.
                </div>
            )}
        </div>
    );
}
