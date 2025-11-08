import axiosInstance from "../../interceptor/interceptor";

export class AdminService {

    async getUsers() {
        try {
            const response = await axiosInstance.get('/users/');
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            throw error;
        }
    }
}