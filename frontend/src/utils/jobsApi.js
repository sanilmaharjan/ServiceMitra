import api from "./api";

const CACHE_TTL = 1000 * 60;
let jobsCache = null;
let jobsCacheTime = 0;

function isJobsCacheValid() {
  return jobsCache && Date.now() - jobsCacheTime < CACHE_TTL;
}

function setJobsCache(data) {
  jobsCache = data;
  jobsCacheTime = Date.now();
}

function clearJobsCache() {
  jobsCache = null;
  jobsCacheTime = 0;
}

const normalizeJob = (job) => {
  if (!job || typeof job !== 'object') return job;

  const statusMap = {
    pending: 'open',
    assigned: 'assigned',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  };

  return {
    ...job,
    status: statusMap[job.status] || job.status,
  };
};

const jobsApi = {
  getCachedJobs: () => (isJobsCacheValid() ? jobsCache : null),

  createJob: async (jobData) => {
    const response = await api.post("/jobs/", jobData);
    clearJobsCache();
    return { data: normalizeJob(response) };
  },
  
  getMyJobs: async () => {
    if (isJobsCacheValid()) {
      return { data: jobsCache };
    }

    const response = await api.get("/jobs/");
    const payload = response?.data ?? response;
    const normalized = Array.isArray(payload) ? payload.map(normalizeJob) : normalizeJob(payload);
    setJobsCache(normalized);
    return { data: normalized };
  },
  
  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return { data: normalizeJob(response) };
  },
  
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}/`, jobData);
    clearJobsCache();
    return { data: normalizeJob(response) };
  },
  
  updateJobPartial: async (id, jobData) => {
    const response = await api.patch(`/jobs/${id}/`, jobData);
    clearJobsCache();
    return { data: normalizeJob(response) };
  },
  
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}/`);
    clearJobsCache();
    return response;
  },
  
  getAvailableJobs: async () => {
    if (isJobsCacheValid()) {
      return { data: jobsCache };
    }
    const response = await api.get("/jobs/");
    const payload = response?.data ?? response;
    const normalized = Array.isArray(payload) ? payload.map(normalizeJob) : normalizeJob(payload);
    setJobsCache(normalized);
    return { data: normalized };
  },
  
  getJobHistory: async () => {
    if (isJobsCacheValid()) {
      return { data: jobsCache };
    }
    const response = await api.get("/jobs/");
    const payload = response?.data ?? response;
    const normalized = Array.isArray(payload) ? payload.map(normalizeJob) : normalizeJob(payload);
    setJobsCache(normalized);
    return { data: normalized };
  },
  
  startJob: (id) => api.post(`/jobs/${id}/start/`),
  
  completeJob: (id) => api.post(`/jobs/${id}/complete/`),
  
  cancelJob: (id) => api.post(`/jobs/${id}/cancel/`),
};

export default jobsApi;
