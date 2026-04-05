import api from "./api";

const authApi = {
  login: (credentials) => api.post("/users/login/", credentials),
  register: (userData) => api.post("/users/register/", userData),
  getProfile: async () => {
    const response = await api.get("/users/profile/");
    return { data: response };
  },
  updateProfile: async (data) => {
    const response = await api.patch("/users/profile/", data);
    return { data: response };
  },
};

export default authApi;
