import axiosInstance from "../interceptor/interceptor";

export async function syncCountries(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/countries/sync");
  return response.data;
}
