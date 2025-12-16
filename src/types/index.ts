// ============================================
// Anka MFO - Tipos Compartilhados
// ============================================

// ============ DOMAIN ============
export interface Money {
    amount: number;
    currency: 'BRL';
}

export interface Client {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Simulation {
    id: string;
    clientId: string;
    name: string;
    startDate: Date;
    interestRate: number;
    inflationRate: number;
    lifeStatus: 'normal' | 'dead' | 'invalid';
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SimulationVersion {
    id: string;
    simulationId: string;
    version: number;
    startDate: Date;
    interestRate: number;
    inflationRate: number;
    lifeStatus: 'normal' | 'dead' | 'invalid';
    patrimonioFinalEstimado: number;
    createdAt: Date;
}

export interface Allocation {
    id: string;
    clientId: string;
    type: 'financial' | 'property';
    name: string;
    value: number;
    date: Date;
    isFinanced?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transaction {
    id: string;
    clientId: string;
    type: 'income' | 'expense' | 'deposit' | 'withdrawal';
    name: string;
    value: number;
    startDate: Date;
    endDate: Date;
    interval: 'monthly' | 'yearly';
    createdAt: Date;
    updatedAt: Date;
}

export interface Insurance {
    id: string;
    clientId: string;
    name: string;
    type: 'life' | 'disability';
    startDate: Date;
    durationMonths: number;
    monthlyPremium: number;
    coverageAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

// ============ API PAYLOADS ============
export interface CreateClientPayload {
    name: string;
    email: string;
}

export interface CreateSimulationPayload {
    name: string;
    startDate: string;
    interestRate: number;
    inflationRate: number;
    lifeStatus?: 'normal' | 'dead' | 'invalid';
}

export interface CreateAllocationPayload {
    type: 'financial' | 'property';
    name: string;
    value: number;
    date: string;
    isFinanced?: boolean;
}

export interface CreateTransactionPayload {
    type: 'income' | 'expense' | 'deposit' | 'withdrawal';
    name: string;
    value: number;
    startDate: string;
    endDate: string;
    interval: 'monthly' | 'yearly';
}

export interface CreateInsurancePayload {
    name: string;
    type: 'life' | 'disability';
    startDate: string;
    durationMonths: number;
    monthlyPremium: number;
    coverageAmount: number;
}

// ============ PROJECTION ============
export interface MonthlyProjection {
    date: Date;
    financialAssets: number;
    propertyAssets: number;
    totalAssets: number;
    realized: number;
}

export interface ProjectionResult {
    monthly: MonthlyProjection[];
    summary: {
        initialAssets: number;
        finalAssets: number;
        totalReturns: number;
        averageAnnualReturn: number;
    };
}

// ============ COMPARISON ============
export interface SimulationComparison {
    simulationId: string;
    name: string;
    initialAssets: number;
    finalAssets: number;
    totalReturns: number;
    projection: MonthlyProjection[];
}
