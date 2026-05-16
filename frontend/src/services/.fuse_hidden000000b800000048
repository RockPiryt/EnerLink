import axiosInstance from "../interceptor/interceptor";

export interface District {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface DistrictListResponse {
  items: District[];
  total: number;
  pages: number;
}

export const getDistricts = async (params?: URLSearchParams): Promise<DistrictListResponse | District[]> => {
  const response = await axiosInstance.get(`/api/address/districts${params ? `?${params}` : ''}`);
  return response.data;
};

export const addDistrict = async (district: { name: string }): Promise<void> => {
  await axiosInstance.post("/api/address/districts", district);
};

export const updateDistrict = async (id: number, district: { name: string }): Promise<void> => {
  await axiosInstance.put(`/api/address/districts/${id}`, district);
};

export const toggleDistrictActive = async (id: number, is_active: boolean): Promise<void> => {
  await axiosInstance.put(`/api/address/districts/${id}`, { is_active });
};

export const deleteDistrict = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/address/districts/${id}`);
};
