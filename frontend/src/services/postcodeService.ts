import axiosInstance from "../interceptor/interceptor";

export async function findPostcode(city: string, street: string, number: string): Promise<{ type: string, postcode?: string, postcodes?: string[] }> {
  const response = await axiosInstance.get("/api/postcode/search", {
    params: { city, street, number }
  });
  return response.data;
}

export async function findCityByPostcode(postcode: string): Promise<{ postcode: string, cities: string[] }> {
  const response = await axiosInstance.get(`/api/postcode/city/${postcode}`);
  return response.data;
}
