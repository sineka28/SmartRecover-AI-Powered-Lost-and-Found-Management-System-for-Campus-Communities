import api from "../services/api";

export const aiChat = async (message, context = "lost_item_reporting") => {
  return await api.post("/ai/chat", { message, context });
};

export const enhanceDescription = async (simpleDescription, category, color) => {
  return await api.post("/ai/enhance-description", { simpleDescription, category, color });
};

export const generateVerificationQuestions = async (itemDescription, itemName) => {
  return await api.post("/ai/verification-questions", { itemDescription, itemName });
};

// Explain why two items match (pass descriptions + score directly)
export const analyzeMatchExplanation = async (lostDescription, foundDescription, matchScore) => {
  return await api.post("/ai/explain-match", { lostDescription, foundDescription, matchScore });
};

export const getAgentsStatus = async () => {
  return await api.get("/ai/agents/status");
};
