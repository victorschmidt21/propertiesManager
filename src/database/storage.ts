import axios from "axios";

export class CloudinaryStorage {
  async uploadPDF(file: File): Promise<string | null> {
    const cloudName = "djonljzmw";
    const uploadPreset = "anon_upload";
    const api = axios.create({
      baseURL: `https://api.cloudinary.com/v1_1`,
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await api.post(`/${cloudName}/upload`, formData);
      const data = response.data;
      console.log("Upload bem-sucedido!");
      return data.secure_url;
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      return null;
    }
  }
}
