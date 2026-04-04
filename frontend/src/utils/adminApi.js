import api from "./api";

const adminApi = {
  getStats: () => api.get("/admin/stats/"),
  
  getUsers: () => api.get("/admin/users/"),
  deleteUser: (id) => api.delete(`/admin/users/${id}/`),
  
  getProviders: () => api.get("/admin/providers/"),
  
  getPendingKYC: () => api.get("/admin/kyc/pending/"),
  verifyKYC: (id, data) => api.patch(`/admin/kyc/${id}/verify/`, data),
  
  getPendingPayouts: () => api.get("/admin/payouts/pending/"),
  getRecentPayouts: () => api.get("/admin/payouts/recent/"),
  createPayout: (data) => api.post("/admin/payouts/", data),
};

export default adminApi;
