import api from "./api";

const categoriesApi = {
  getCategories: () => api.get("/categories/"),
  
  createCategory: (data) => api.post("/categories/create/", data),
  
  updateCategory: (id, data) => api.put(`/categories/${id}/update/`, data),
  
  deleteCategory: (id) => api.delete(`/categories/${id}/delete/`),
};

export default categoriesApi;
