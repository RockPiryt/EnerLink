import axiosInstance from "../interceptor/interceptor";

export interface RankingItem {
    id: string;
    name: string;
    value: number;
}

export interface RankingResponse {
    ranking: RankingItem[];
    generated_at: string | null;
}

export interface CustomerServiceReport {
    num_customers: number;
    avg_realization_days: number | null;
    signed_contracts: number;
    cancelled_contracts: number;
    new_contracts: number;
}

export interface MonthlyEfficiency {
    month: number;
    count: number;
}

export interface SalespersonEfficiency {
    salesperson: string;
    monthly: MonthlyEfficiency[];
}

export interface EfficiencyResponse {
    efficiency: SalespersonEfficiency[];
}

export const getRanking = async (params?: { month?: number | ''; year?: number | '' }): Promise<RankingResponse> => {
    const response = await axiosInstance.get("/api/manager/ranking", { params });
    return response.data;
};

export const getCustomerServiceReport = async (params?: { month?: number | ''; year?: number | '' }): Promise<CustomerServiceReport> => {
    const response = await axiosInstance.get("/api/manager/customer_service_report", { params });
    return response.data;
};

export const getEfficiency = async (year?: number): Promise<EfficiencyResponse> => {
    const response = await axiosInstance.get("/api/manager/efficiency", {
        params: year ? { year } : undefined,
    });
    return response.data;
};
