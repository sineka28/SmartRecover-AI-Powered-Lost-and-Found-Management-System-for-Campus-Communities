import api from "../services/api";

export const addLostItem = async (lostItem) => {
  return await api.post("/lost-items", lostItem);
};

export const getAllLostItems = async () => {
  return await api.get("/lost-items");
};

export const getMyLostItems = async () => {
  return await api.get("/lost-items/my");
};

export const getLostItemById = async (id) => {
  return await api.get(`/lost-items/${id}`);
};

export const updateLostItem = async (id, data) => {
  return await api.put(`/lost-items/${id}`, data);
};

export const deleteLostItem = async (id) => {
  return await api.delete(`/lost-items/${id}`);
};
