import axiosInstance from "../../interceptor/interceptor";

export class TariffService {

    async getTariffs(params:any) {
        try {
            const response = await axiosInstance.get(`/api/supplier/tariffs?${params}`);
            return response.data;
        } catch (error: any) {
            throw error.response?.data?.error || error;
        }
    }
}