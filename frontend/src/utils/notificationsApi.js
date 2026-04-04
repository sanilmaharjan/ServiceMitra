import api from "./api";

const notificationsApi = {
  getNotifications: () => api.get("/notifications/"),
  
  getUnreadCount: () => api.get("/notifications/unread-count/"),
  
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  
  markAllAsRead: () => api.post("/notifications/mark-all-read/"),
  
  deleteNotification: (id) => api.delete(`/notifications/${id}/delete/`),
};

export default notificationsApi;
