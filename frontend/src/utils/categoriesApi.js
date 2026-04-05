import api from "./api";

const CACHE_TTL = 1000 * 60;
let categoriesCache = null;
let categoriesCacheTime = 0;

function isCategoriesCacheValid() {
  return categoriesCache && Date.now() - categoriesCacheTime < CACHE_TTL;
}

function setCategoriesCache(data) {
  categoriesCache = data;
  categoriesCacheTime = Date.now();
}

function clearCategoriesCache() {
  categoriesCache = null;
  categoriesCacheTime = 0;
}

const categoriesApi = {
  getCachedCategories: () => (isCategoriesCacheValid() ? categoriesCache : null),

  getCategories: async () => {
    if (isCategoriesCacheValid()) {
      return { data: categoriesCache };
    }
    const response = await api.get("/categories/");
    const payload = response?.data ?? response;
    setCategoriesCache(payload);
    return { data: payload };
  },
  
  createCategory: async (data) => {
    const response = await api.post("/categories/create/", data);
    clearCategoriesCache();
    return response;
  },
  
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}/update/`, data);
    clearCategoriesCache();
    return response;
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}/delete/`);
    clearCategoriesCache();
    return response;
  },
};

export default categoriesApi;
