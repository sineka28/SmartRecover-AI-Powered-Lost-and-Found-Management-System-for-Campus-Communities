import api from "../services/api";

// Get all matches
export const getAllMatches = async () => {
  return await api.get("/matches", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Run AI Matching
export const findMatches = async () => {
  return await api.post(
    "/matches/find",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

// Update Match Status
export const updateMatchStatus = async (id, status) => {
  return await api.put(
    `/matches/${id}/status?status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};