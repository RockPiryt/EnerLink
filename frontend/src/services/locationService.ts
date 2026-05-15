
import axiosInstance from "../interceptor/interceptor";

export async function syncPostcodes(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/sync/postcodes");
  return response.data;
}

export async function syncCountries(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/sync/countries");
  return response.data;
}

export async function syncCities(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/sync/cities");
  return response.data;
}

export async function syncProvinces(): Promise<{message: string, added: number, total: number}> {
  const response = await axiosInstance.post("/api/sync/districts");
  return response.data;
}
