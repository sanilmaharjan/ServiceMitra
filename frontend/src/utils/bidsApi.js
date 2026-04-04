import api from "./api";

const bidsApi = {
  createBid: (jobId, bidData) => api.post(`/jobs/${jobId}/bids/`, bidData),
  
  getJobBids: (jobId) => api.get(`/jobs/${jobId}/bids/list/`),
  
  acceptBid: (bidId) => api.post(`/jobs/bids/${bidId}/accept/`),
  
  rejectBid: (bidId) => api.post(`/jobs/bids/${bidId}/reject/`),
  
  getMyBids: () => api.get("/jobs/my-bids/"),
  
  updateBid: (bidId, bidData) => api.patch(`/bids/${bidId}/`, bidData),
  
  deleteBid: (bidId) => api.delete(`/bids/${bidId}/`),
};

export default bidsApi;
