import api from "../services/api";

export const getMyNotifications = async () => {
  return await api.get("/notifications");
};

export const getUnreadCount = async () => {
  return await api.get("/notifications/unread-count");
};

export const markAsRead = async (id) => {
  return await api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return await api.put("/notifications/read-all");
};
