import axiosInstance from "../../interceptor/interceptor";

export class AuthService {

    async login(email: string, password: string) {
        try {
            const response = await axiosInstance.post("/api/login", {
                email,
                password,
            });
            // Backend returns: { message, token, user } or { error }
            return {
                message: response.data.message,
                token: response.data.token,
                user: response.data.user,
                error: response.data.error,
                status: response.status,
            };
        } catch (error: any) {
            // Pass backend error message if available
            throw error.response?.data?.error || error;
        }
    }
}