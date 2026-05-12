import axiosInstance from "../interceptor/interceptor";

export interface City {
  id: number;
  name: string;
  postal_code: string;
  province?: string;
  country_id?: number;
}

export const getCities = async (params?: { name?: string; postal_code?: string; country_id?: number }): Promise<City[]> => {
  const response = await axiosInstance.get("/api/address/cities", { params });
  return response.data;
};
