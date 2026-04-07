import axiosInstance from "../interceptor/interceptor";

export interface MonthlyData {
    month: number;
    count: number;
    monthName?: string;
}

export interface YearlyData {
    year: number;
    count: number;
}

export interface AnalyticsData {
    monthly: MonthlyData[];
    yearly: YearlyData[];
}

export const getContractAnalytics = async (year?: number): Promise<AnalyticsData> => {
    const response = await axiosInstance.get("/api/sales/analytics/contracts", {
        params: year ? { year } : undefined,
    });
    return response.data;
};
