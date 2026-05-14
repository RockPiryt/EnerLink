import axiosInstance from "../interceptor/interceptor";

export interface GusCompanyData {
  name: string;
  nip: string;
  regon: string;
  street: string;
  building: string;
  local: string;
  postcode: string;
  city: string;
  source: string;
}

// Standard GUS NIP lookup endpoint
export async function lookupNip(nip: string): Promise<GusCompanyData> {
  const response = await axiosInstance.get(`/api/lookup/nip/${nip}`);
  return response.data;
}
