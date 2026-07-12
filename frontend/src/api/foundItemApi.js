import api from "../services/api";

export const addFoundItem = async (foundItem) => {
  return await api.post("/found-items", foundItem);
};

export const getAllFoundItems = async () => {
  return await api.get("/found-items");
};

export const getMyFoundItems = async () => {
  return await api.get("/found-items/my");
};

export const getFoundItemById = async (id) => {
  return await api.get(`/found-items/${id}`);
};

export const updateFoundItem = async (id, data) => {
  return await api.put(`/found-items/${id}`, data);
};

export const deleteFoundItem = async (id) => {
  return await api.delete(`/found-items/${id}`);
};
