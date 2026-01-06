import axiosInstance from "../interceptor/interceptor";

export interface Provider {
  id: number;
  name: string;
  created_at: string;
}

export const getProviders = async (): Promise<Provider[]> => {
  const response = await axiosInstance.get("/api/providers");
  return response.data;
};

export const addProvider = async (provider: { name: string }): Promise<void> => {
  await axiosInstance.post("/api/providers", provider);
};
