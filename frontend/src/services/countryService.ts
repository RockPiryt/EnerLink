import axiosInstance from "../interceptor/interceptor";

export interface Country {
  id: number;
  name: string;
  shortcut: string;
  is_active: boolean;
  created_at: string;
}

export const getCountries = async (): Promise<Country[]> => {
  const response = await axiosInstance.get("/api/address/countries");
  return response.data;
};

export const addCountry = async (country: { name: string; shortcut: string }): Promise<void> => {
  await axiosInstance.post("/api/address/countries", country);
};

export const updateCountryStatus = async (id: number, is_active: boolean): Promise<void> => {
  await axiosInstance.patch(`/api/address/countries/${id}/status`, { is_active });
};
