"use client";
import ProjectionChart from './ProjectionChart';

// Simple mock series generator (deterministic)
const hashString = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
};

const seededFraction = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

const makeSeries = (name: string, offset = 0) => {
    const data = Array.from({ length: 20 }).map((_, i) => {
        const seed = hashString(`${name}-${i}`) + offset;
        return { x: 2025 + i, y: Math.round(100000 + seededFraction(seed) * 500000 + offset * 10000) };
    });
    return { name, data };
};

interface ProjectionChartClientProps {
    selectedClient?: string;
}

export default function ProjectionChartClient({ selectedClient }: ProjectionChartClientProps) {
    // incorporate selectedClient into seed offset to change series per client
    const clientOffset = selectedClient ? hashString(selectedClient) % 10000 : 0;
    const s1 = makeSeries('base', 0 + clientOffset);
    const s2 = makeSeries('conservative', 5000 + clientOffset);
    const s3 = makeSeries('aggressive', 15000 + clientOffset);
    return <ProjectionChart series={[s1, s2, s3]} />;
}
