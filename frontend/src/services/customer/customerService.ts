import axiosInstance from "../../interceptor/interceptor";

export interface Customer {
    id: number;
    company?: string;
    name?: string;
    last_name?: string;
    email: string;
    phone?: string;
    active?: boolean;
    created_at?: string;
}

export interface CustomersResponse {
    items: Customer[];
    page: number;
    per_page: number;
    total: number;
    pages: number;
}

export const getCustomers = async (params?: {
    q?: string;
    active?: boolean;
    page?: number;
    per_page?: number;
}): Promise<any> => {
    return await axiosInstance.get("/api/customers", { params });
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
    await axiosInstance.delete(`/api/customers/${customerId}`);
};
