import axios from "axios";
import { BASE_URL } from "./url";

interface UploadedFile {
  url: string;
  type: string;
}

export const uploadProduct = async (files) => {
  const uploaded: UploadedFile[] = [];

  for (let file of files) {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BASE_URL}/upload/product`, formData, {
        withCredentials: true,
      });

      const fileData = res.data;
      if (!fileData?.url) throw new Error("Upload failed");

      uploaded.push({ url: fileData.url, type: fileData.type });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  }
  return uploaded;
};
