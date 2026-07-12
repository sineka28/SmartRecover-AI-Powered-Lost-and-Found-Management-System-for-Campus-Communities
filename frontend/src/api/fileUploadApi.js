import api from "../services/api";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
