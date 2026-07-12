import api from "../services/api";

export const getAnalytics = async () => {
  return await api.get("/analytics");
};
