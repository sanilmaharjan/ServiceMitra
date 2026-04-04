import api from "./api";

const authApi = {
  login: (credentials) => api.post("/users/login/", credentials),
  register: (userData) => api.post("/users/register/", userData),
  getProfile: () => api.get("/users/profile/"),
  updateProfile: (data) => api.patch("/users/profile/", data),
};

export default authApi;
