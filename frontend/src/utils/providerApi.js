import api from "./api";

const providerApi = {
  getStats: () => api.get("/provider/stats/"),
  
  getProfile: () => api.get("/provider/profile/"),
  
  updateProfile: (data) => api.patch("/provider/profile/", data),
  
  getPortfolio: () => api.get("/provider/portfolio/"),
};

export default providerApi;
