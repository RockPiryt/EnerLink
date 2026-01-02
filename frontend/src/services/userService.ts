import axiosInstance from "../interceptor/interceptor";

export interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    id_role: number;
    role_name: string;
    active: boolean;
    created_at: string;
}

export interface UsersResponse {
    items: User[];
    page: number;
    per_page: number;
    total: number;
    pages: number;
}

export class UserService {
    async getUsers(params?: {
        q?: string;
        active?: boolean;
        page?: number;
        per_page?: number;
    }): Promise<UsersResponse> {
        try {
            const response = await axiosInstance.get("/api/users", { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId: string): Promise<User> {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}