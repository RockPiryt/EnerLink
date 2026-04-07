import axiosInstance from "../interceptor/interceptor";

export interface Contract {
    id: number;
    contract_number: string;
    signed_at?: string;
    contract_from?: string;
    contract_to?: string;
    status?: string;
    customer?: {
        company?: string;
        name?: string;
    };
    created_at?: string;
}

export interface ContractsResponse {
    items: Contract[];
    page: number;
    per_page: number;
    total: number;
    pages: number;
}

export const getContracts = async (params?: {
    q?: string;
    status?: string;
    page?: number;
    per_page?: number;
}): Promise<any> => {
    const response = await axiosInstance.get("/api/contracts", { params });
    return response.data;
};

export const getContractById = async (contractId: number | string): Promise<Contract> => {
    const response = await axiosInstance.get(`/api/contracts/${contractId}`);
    return response.data;
};

export const updateContract = async (contractId: number | string, data: Partial<Contract>): Promise<Contract> => {
    const response = await axiosInstance.put(`/api/contracts/${contractId}`, data);
    return response.data;
};

export const deleteContract = async (contractId: number): Promise<void> => {
    await axiosInstance.delete(`/api/contracts/${contractId}`);
};
