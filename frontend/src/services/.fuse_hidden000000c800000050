import axiosInstance from "../interceptor/interceptor";

export interface PKWiU {
  id: number;
  pkwiu_nr: string;
  pkwiu_name: string;
}

export interface PKWiUListResponse {
  items: PKWiU[];
  total: number;
  pages: number;
}

export const getPkwius = async (params?: URLSearchParams): Promise<PKWiUListResponse | PKWiU[]> => {
  const response = await axiosInstance.get(`/api/pkwiu${params ? `?${params}` : ''}`);
  return response.data;
};

export const addPkwiu = async (pkwiu: { pkwiu_nr: string; pkwiu_name: string }): Promise<void> => {
  await axiosInstance.post("/api/pkwiu", pkwiu);
};

export const updatePkwiu = async (id: number, pkwiu: { pkwiu_nr: string; pkwiu_name: string }): Promise<void> => {
  await axiosInstance.put(`/api/pkwiu/${id}`, pkwiu);
};

export const deletePkwiu = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/pkwiu/${id}`);
};
