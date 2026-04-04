import api from "./api";

const adminApi = {
  // User management
  getUsers: () => api.get("/admin/users/"),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}/delete/`),
  
  // Provider management  
  getProviders: () => api.get("/users/providers/"),
  
  // KYC/Pending verifications
  getPendingKYC: () => api.get("/admin/pending/"),
  approveKYC: (providerId, data) => api.post(`/admin/${providerId}/approve/`, data),
  rejectKYC: (providerId, data) => api.post(`/admin/${providerId}/reject/`, data),
};

export default adminApi;