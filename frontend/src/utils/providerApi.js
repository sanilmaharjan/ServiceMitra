import api from "./api";

const providerApi = {
  getStats: async () => {
    const response = await api.get("/provider/stats/");
    return { data: response };
  },
  
  getProfile: async () => {
    const response = await api.get("/provider/profile/");
    return { data: response };
  },
  
  updateProfile: async (data) => {
    const response = await api.patch("/provider/profile/", data);
    return { data: response };
  },
  
  getPortfolio: async () => {
    const response = await api.get("/provider/portfolio/");
    return { data: response };
  },
};

export default providerApi;
