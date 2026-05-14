import axiosInstance from "../interceptor/interceptor";

export async function syncCountries(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/countries/sync");
  return response.data;
}

export async function syncCities(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/cities/sync");
  return response.data;
}

export async function syncProvinces(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/provinces/sync");
  return response.data;
}
