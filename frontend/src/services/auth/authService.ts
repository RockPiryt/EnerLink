import axiosInstance from "../../interceptor/interceptor";

export class AuthService {

    async login(email: string, password: string) {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password,
            });
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            throw error;
        }
    }
}