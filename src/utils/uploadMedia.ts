import axios from "axios";
import { BASE_URL } from "./url";

export const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
  const uploaded: string[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post<{ url: string; type: string }>(
        `${BASE_URL}/upload/product`,
        formData,
        {
          withCredentials: true,
        }
      );

      const fileData = res.data;
      if (!fileData?.url) throw new Error("Upload failed");

      uploaded.push(fileData.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }

  return uploaded;
};
