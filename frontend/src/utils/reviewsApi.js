import api from "./api";

const reviewsApi = {
  getAllReviews: () => api.get("/reviews/"),
  
  getReviewById: (id) => api.get(`/reviews/${id}/`),
  
  createReview: (jobId, reviewData) => api.post(`/reviews/job/${jobId}/`, reviewData),
  
  updateReview: (id, reviewData) => api.put(`/reviews/${id}/update/`, reviewData),
  
  deleteReview: (id) => api.delete(`/reviews/${id}/delete/`),
  
  respondToReview: (id, response) => api.post(`/reviews/${id}/respond/`, { response }),
};

export default reviewsApi;
