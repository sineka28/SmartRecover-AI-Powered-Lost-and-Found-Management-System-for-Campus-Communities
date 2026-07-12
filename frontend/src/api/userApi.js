import api from "../services/api";

export const registerUser = async (user) => {
  return await api.post("/auth/register", user);
};

export const loginUser = async (loginData) => {
  return await api.post("/auth/login", loginData);
};

export const getCurrentUser = async () => {
  return await api.get("/users/me");
};

export const updateCurrentUser = async (data) => {
  return await api.put("/users/me", data);
};

export const getAllUsers = async () => {
  return await api.get("/users");
};
