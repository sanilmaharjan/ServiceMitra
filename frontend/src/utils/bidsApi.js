import api from "./api";

const normalizeBid = (bid) => {
  const statusMap = {
    submitted: 'pending',
    accepted: 'accepted',
    rejected: 'rejected',
    withdrawn: 'withdrawn',
  };

  const providerName = bid.provider_name || '';
  const createdAt = bid.created_at ? new Date(bid.created_at) : null;
  const placedAt = createdAt ? createdAt.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '';

  return {
    ...bid,
    status: statusMap[bid.status] || bid.status,
    myBid: Number(bid.amount || 0),
    note: bid.message || '',
    placedAt,
    postTitle: bid.job_title || `Job #${bid.job}`,
    client: bid.client_name || '',
    location: bid.job_location || bid.job_address || '',
    budget: bid.job_budget ? Number(bid.job_budget).toLocaleString() : bid.job_budget || '',
    bidder: {
      id: bid.provider,
      name: providerName,
      initials: providerName.split(' ').filter(Boolean).map((part) => part[0]).join('').toUpperCase(),
      category: bid.provider_category || '',
      location: bid.job_location || bid.job_address || '',
      bio: bid.provider_bio || '',
      rating: bid.provider_rating || '',
      jobs: bid.provider_jobs || 0,
    },
  };
};

const bidsApi = {
  createBid: (jobId, bidData) => api.post(`/jobs/${jobId}/bids/`, bidData),
  
  getJobBids: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/bids/list/`);
    const data = Array.isArray(response) ? response.map(normalizeBid) : [];
    return { data };
  },
  
  acceptBid: (bidId) => api.post(`/jobs/bids/${bidId}/accept/`),
  
  rejectBid: (bidId) => api.post(`/jobs/bids/${bidId}/reject/`),
  
  getMyBids: async () => {
    const response = await api.get("/jobs/my-bids/");
    const data = Array.isArray(response) ? response.map(normalizeBid) : [];
    return { data };
  },
  
  getBidDetail: async (bidId) => {
    const response = await api.get(`/jobs/bids/${bidId}/`);
    return { data: normalizeBid(response) };
  },
  
  updateBid: (bidId, bidData) => api.patch(`/bids/${bidId}/`, bidData),
  
  deleteBid: (bidId) => api.delete(`/bids/${bidId}/`),
};

export default bidsApi;
