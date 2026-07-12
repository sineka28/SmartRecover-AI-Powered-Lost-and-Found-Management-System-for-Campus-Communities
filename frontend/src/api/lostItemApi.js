import api from "../services/api";

// Add Lost Item
export const addLostItem = async (lostItem) => {
  return await api.post("/lost-items", lostItem, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Get All Lost Items
export const getAllLostItems = async () => {
  return await api.get("/lost-items", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};