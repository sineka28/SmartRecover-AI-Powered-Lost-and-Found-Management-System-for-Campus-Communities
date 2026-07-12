import api from "../services/api";

export const getAllMatches = async () => {
  return await api.get("/matches");
};

export const getMatchById = async (id) => {
  return await api.get(`/matches/${id}`);
};

export const findMatches = async () => {
  return await api.post("/matches/find", {});
};

export const updateMatchStatus = async (id, status) => {
  return await api.put(`/matches/${id}/status`, { status });
};
