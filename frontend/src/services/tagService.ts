import axiosInstance from "../interceptor/interceptor";

export interface Tag {
    id: number;
    name: string;
    created_at?: string;
}

export const getTags = async (): Promise<Tag[]> => {
    const response = await axiosInstance.get("/api/tags");
    return response.data;
};

export const deleteTag = async (tagId: number): Promise<void> => {
    await axiosInstance.delete(`/api/tags/${tagId}`);
};
