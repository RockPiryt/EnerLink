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
            console.error('Error fetching users:', error);
        }
    }

    async deleteUser(userId: string) {
        try {
            // await axiosInstance.delete(`/users/${userId}`); //TODO: set up correct endpoint when backend will be ready
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    async addUser(userData: any) {
        try {
            // const response = await axiosInstance.post('/users/', userData); //TODO: set up correct endpoint when backend will be ready
            // return response.data;
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }

    async updateUser(userId:number, updatedUser:any) {
        try {
            await axiosInstance.patch(''); //TODO: set up correct endpoint when backend will be ready
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }
}