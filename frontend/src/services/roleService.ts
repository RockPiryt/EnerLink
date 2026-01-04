
import axiosInstance from "../interceptor/interceptor";
import { Role } from "../models/role";

export class RoleService {
  async getRoles(): Promise<Role[]> {
    const response = await axiosInstance.get("/api/roles");
    return response.data.items || response.data;
  }

  async addRole(role: { role_name: string }): Promise<void> {
    await axiosInstance.post("/api/roles", role);
  }

  async editRole(roleId: string, role: { role_name: string; active?: boolean }): Promise<void> {
    await axiosInstance.put(`/api/roles/${roleId}`, role);
  }

  async deleteRole(roleId: string): Promise<void> {
    await axiosInstance.delete(`/api/roles/${roleId}`);
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    await axiosInstance.post(`/api/users/${userId}/assign_role`, { role_id: roleId });
  }
}
