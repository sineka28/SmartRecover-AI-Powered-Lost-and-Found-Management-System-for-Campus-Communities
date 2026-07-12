import api from "../services/api";

export const submitClaim = async (foundItemId, verificationDetails) => {
  return await api.post("/claims", { foundItemId, verificationDetails });
};

export const getMyClaims = async () => {
  return await api.get("/claims/my");
};

export const getAllClaims = async () => {
  return await api.get("/claims");
};

export const updateClaimStatus = async (id, status, adminRemarks) => {
  return await api.put(`/claims/${id}/status`, { status, adminRemarks });
};
