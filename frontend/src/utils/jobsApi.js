import api from "./api";

const jobsApi = {
  createJob: (jobData) => api.post("/jobs/", jobData),
  
  getMyJobs: () => api.get("/jobs/"),
  
  getJobById: (id) => api.get(`/jobs/${id}`),
  
  updateJob: (id, jobData) => api.put(`/jobs/${id}/`, jobData),
  
  updateJobPartial: (id, jobData) => api.patch(`/jobs/${id}/`, jobData),
  
  deleteJob: (id) => api.delete(`/jobs/${id}/`),
  
  getAvailableJobs: () => api.get("/jobs/"),
  
  getJobHistory: () => api.get("/jobs/"),
  
  startJob: (id) => api.post(`/jobs/${id}/start/`),
  
  completeJob: (id) => api.post(`/jobs/${id}/complete/`),
  
  cancelJob: (id) => api.post(`/jobs/${id}/cancel/`),
};

export default jobsApi;
