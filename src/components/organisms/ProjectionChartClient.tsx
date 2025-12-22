"use client";
import React from 'react';
import ProjectionChart from './ProjectionChart';

interface ProjectionChartClientProps {
    selectedClient?: string | undefined;
}

interface YearlyData {
    year: number;
    totalAssets: number;
}

interface SignificantChange {
    year: number;
    value: number;
}

export default function ProjectionChartClient({ selectedClient }: ProjectionChartClientProps) {
    const [loading, setLoading] = React.useState(false);
    const [idealProjection, setIdealProjection] = React.useState<{ year: number; value: number }[]>([]);
    const [realizedHistory, setRealizedHistory] = React.useState<{ year: number; value: number }[]>([]);
    const [projectedFromReal, setProjectedFromReal] = React.useState<{ year: number; value: number }[]>([]);
    const [significantChanges, setSignificantChanges] = React.useState<SignificantChange[]>([]);

    React.useEffect(() => {
        let mounted = true;

        const fetchProjectionData = async (clientId?: string) => {
            if (!clientId) {
                if (mounted) {
                    setIdealProjection([]);
                    setRealizedHistory([]);
                    setProjectedFromReal([]);
                    setSignificantChanges([]);
                }
                return;
            }

            setLoading(true);
            try {
                // 1) Fetch simulations for client
                const simsUrl = `http://localhost:3333/clients/${clientId}/simulations`;
                const simsRes = await fetch(simsUrl);
                if (!simsRes.ok) throw new Error(`Failed to fetch simulations: ${simsRes.status}`);
                const simsBody = await simsRes.json();
                const sims = simsBody.success && Array.isArray(simsBody.data)
                    ? simsBody.data
                    : (Array.isArray(simsBody) ? simsBody : []);
                const sim = sims[0];

                if (!sim || !sim.id) {
                    console.warn('No simulation found for client');
                    if (mounted) {
                        setIdealProjection([]);
                        setRealizedHistory([]);
                        setProjectedFromReal([]);
                    }
                    return;
                }

                // 2) Fetch projection for simulation (projeção ideal)
                const projUrl = `http://localhost:3333/simulations/${sim.id}/projection`;
                const projRes = await fetch(projUrl);
                if (!projRes.ok) throw new Error(`Failed to fetch projection: ${projRes.status}`);
                const projBody = await projRes.json();
                const proj = projBody.success ? projBody.data : projBody;

                // Map yearly data to ideal projection (linha azul tracejada)
                const yearly: YearlyData[] = Array.isArray(proj.yearly) ? proj.yearly : [];
                const ideal = yearly.map((y) => ({
                    year: y.year,
                    value: y.totalAssets
                }));

                // 3) Fetch allocations to build real history based on actual dates
                const allocationsUrl = `http://localhost:3333/simulations/${sim.id}/allocations`;
                const allocationsRes = await fetch(allocationsUrl);
                const realizedData: { year: number; value: number }[] = [];
                const changes: SignificantChange[] = [];

                if (allocationsRes.ok) {
                    const allocationsBody = await allocationsRes.json();
                    const allocations = allocationsBody.success && Array.isArray(allocationsBody.data)
                        ? allocationsBody.data
                        : [];

                    const currentYear = new Date().getFullYear();

                    // Group allocations by year based on their allocationDate
                    interface AllocationData {
                        id: string;
                        initialValue: number;
                        annualReturn: number;
                        allocationDate?: string | null;
                    }

                    // Build cumulative value by year from allocations
                    const allocationsByYear = new Map<number, { added: number; rate: number }>();

                    // Process each allocation
                    allocations.forEach((alloc: AllocationData) => {
                        const allocDate = alloc.allocationDate ? new Date(alloc.allocationDate) : new Date();
                        const allocYear = allocDate.getFullYear();

                        if (!allocationsByYear.has(allocYear)) {
                            allocationsByYear.set(allocYear, { added: 0, rate: 0 });
                        }

                        const yearData = allocationsByYear.get(allocYear)!;
                        yearData.added += alloc.initialValue || 0;
                        // Weighted average for return rate
                        yearData.rate = (yearData.rate + (alloc.annualReturn || 0)) / 2;
                    });

                    // Sort years and build cumulative history
                    const sortedYears = Array.from(allocationsByYear.keys()).sort((a, b) => a - b);

                    if (sortedYears.length > 0) {
                        let cumulativeValue = 0;
                        let avgRate = 0.08; // Default 8% annual return

                        // Calculate the average rate from all allocations
                        let totalRate = 0;
                        let rateCount = 0;
                        allocationsByYear.forEach((data) => {
                            if (data.rate > 0) {
                                totalRate += data.rate;
                                rateCount++;
                            }
                        });
                        if (rateCount > 0) {
                            avgRate = (totalRate / rateCount) / 100; // Convert percentage to decimal
                        }

                        const startYear = sortedYears[0];
                        const endRealYear = Math.min(currentYear, yearly.length > 0 ? yearly[yearly.length - 1].year : currentYear);

                        // Build year-by-year real history
                        for (let year = startYear; year <= endRealYear; year++) {
                            // Apply growth to existing value
                            if (year > startYear) {
                                cumulativeValue = cumulativeValue * (1 + avgRate);
                            }

                            // Add new allocations for this year
                            if (allocationsByYear.has(year)) {
                                const yearAlloc = allocationsByYear.get(year)!;
                                cumulativeValue += yearAlloc.added;

                                // Mark as significant change when new allocation is added
                                if (yearAlloc.added > 0 && realizedData.length > 0) {
                                    changes.push({ year, value: Math.round(cumulativeValue) });
                                }
                            }

                            realizedData.push({
                                year,
                                value: Math.round(cumulativeValue)
                            });
                        }
                    }
                }

                // 4) Generate projected from real (previsão futura baseada no histórico real)
                // A previsão verde continua do último ponto real, mas com crescimento menor que o ideal
                if (realizedData.length > 0) {
                    const lastReal = realizedData[realizedData.length - 1];
                    const lastRealYear = lastReal.year;
                    const lastRealValue = lastReal.value;

                    // Taxa de crescimento conservadora (menor que a ideal)
                    // Pegar a taxa média da projeção ideal e reduzir um pouco
                    let avgGrowthRate = 0.06; // Default 6% (conservador)

                    if (yearly.length >= 2) {
                        const firstIdeal = yearly[0].totalAssets;
                        const lastIdeal = yearly[yearly.length - 1].totalAssets;
                        const totalYears = yearly.length - 1;
                        if (totalYears > 0 && firstIdeal > 0) {
                            // Taxa ideal menos 1-2% para ser mais conservador
                            const idealRate = Math.pow(lastIdeal / firstIdeal, 1 / totalYears) - 1;
                            avgGrowthRate = Math.max(0.03, idealRate * 0.85); // 85% da taxa ideal, mínimo 3%
                        }
                    }

                    // Project forward from last real value
                    const projectedFuture = [{ year: lastRealYear, value: lastRealValue }];
                    const endYear = yearly.length > 0
                        ? yearly[yearly.length - 1].year
                        : lastRealYear + 20;

                    let currentValue = lastRealValue;
                    for (let year = lastRealYear + 1; year <= endYear; year++) {
                        currentValue = currentValue * (1 + avgGrowthRate);
                        projectedFuture.push({ year, value: Math.round(currentValue) });
                    }

                    if (mounted) {
                        setProjectedFromReal(projectedFuture);
                    }
                }

                if (mounted) {
                    setIdealProjection(ideal);
                    setRealizedHistory(realizedData);
                    setSignificantChanges(changes);
                }
            } catch (err) {
                console.error('Error in fetchProjectionData:', err);
                if (mounted) {
                    setIdealProjection([]);
                    setRealizedHistory([]);
                    setProjectedFromReal([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchProjectionData(selectedClient);
        return () => { mounted = false; };
    }, [selectedClient]);

    const hasData = idealProjection.length > 0 || realizedHistory.length > 0;

    return (
        <div className="h-full">
            {loading && (
                <div className="h-full flex items-center justify-center text-[#C9C9C9]">
                    Carregando projeção...
                </div>
            )}
            {!loading && hasData && (
                <ProjectionChart
                    idealProjection={idealProjection}
                    realizedHistory={realizedHistory}
                    projectedFromReal={projectedFromReal}
                    significantChanges={significantChanges}
                />
            )}
            {!loading && !hasData && (
                <div className="h-full flex items-center justify-center text-[#757575] font-work-sans">
                    Nenhuma projeção disponível para este cliente.
                </div>
            )}
        </div>
    );
}
