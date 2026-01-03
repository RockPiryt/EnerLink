import axiosInstance from "../../interceptor/interceptor";

export class AdminService {

    async getUsers() {
        try {
            // Use the correct endpoint and return an array for AdminPanel compatibility
            const response = await axiosInstance.get('/api/users', { params: { per_page: 100 } });
            // If backend returns {items: User[]} structure, extract items, else fallback
            if (Array.isArray(response.data.items)) {
                return { data: response.data.items, status: response.status };
            }
            // If backend returns array directly
            if (Array.isArray(response.data)) {
                return { data: response.data, status: response.status };
            }
            // Fallback: return empty array
            return { data: [], status: response.status };
        } catch (error) {
            console.error('Error fetching users:', error);
            return { data: [], status: 500 };
        }
    }

    async deleteUser(userId: string) {
        try {
            // await axiosInstance.delete(`/users/${userId}`); //TODO: set up correct endpoint when backend will be ready
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    /**
     * Add a new user using the backend API.
     * @param userData - Data for the new user
     */
    async addUser(userData: any) {
        try {
            // The correct endpoint should be '/api/users' according to backend REST API documentation
            const response = await axiosInstance.post('/api/users', userData);
            return response.data;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    async updateUser(userId: string, updatedUser: any) {
        try {
            const response = await axiosInstance.patch(`/api/users/${userId}`, updatedUser);
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }
}