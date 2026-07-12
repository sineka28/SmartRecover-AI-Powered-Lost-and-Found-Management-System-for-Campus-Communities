import api from "../services/api";

// Add Found Item
export const addFoundItem = async (foundItem) => {
  return await api.post("/found-items", foundItem, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Get All Found Items
export const getAllFoundItems = async () => {
  return await api.get("/found-items", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};