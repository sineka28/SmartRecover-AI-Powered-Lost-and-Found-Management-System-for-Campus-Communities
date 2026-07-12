import api from "../services/api";

// Register User
export const registerUser = async (user) => {
  return await api.post("/users", user);
};

// Login User
export const loginUser = async (loginData) => {
  return await api.post("/users/login", loginData);
};