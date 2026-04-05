import api from "./api";

const adminApi = {
  // User management
  getUsers: async () => {
    const response = await api.get("/admin/users/");
    return { data: response };
  },
  deleteUser: (userId) => api.delete(`/admin/users/${userId}/delete/`),
  
  // Provider management  
  getProviders: async () => {
    const response = await api.get("/users/providers/");
    return { data: response };
  },
  
  // KYC/Pending verifications
  getPendingKYC: async () => {
    const response = await api.get("/admin/pending/");
    return { data: response };
  },
  approveKYC: (providerId, data) => api.post(`/admin/${providerId}/approve/`, data),
  rejectKYC: (providerId, data) => api.post(`/admin/${providerId}/reject/`, data),

  // Category management
  getCategories: async () => {
    const response = await api.get("/categories/");
    return { data: response };
  },
  createCategory: (data) => api.post("/categories/create/", data),
  updateCategory: (id, data) => api.put(`/categories/${id}/update/`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}/delete/`),

  // Payment management
  getPendingProviders: async () => {
    const response = await api.get("/payment/admin/pending-providers/");
    return { data: response };
  },
  payProvider: (providerId, data) => api.post(`/payment/admin/pay-provider/${providerId}/`, data),
  getPaymentHistory: async () => {
    const response = await api.get("/payment/admin/payment-history/");
    return { data: response };
  },
};

export default adminApi;