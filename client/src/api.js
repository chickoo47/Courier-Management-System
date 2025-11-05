import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Courier API calls
export const courierAPI = {
  // Get all couriers
  getAllCouriers: () => api.get('/couriers'),
  
  // PROCEDURE 1: Add courier (MUST use stored procedure)
  addCourier: (courierData) => api.post('/couriers/add', courierData),
  
  // PROCEDURE 2: Update courier status (MUST use stored procedure)
  updateCourierStatus: (courierId, statusData) => 
    api.put(`/couriers/update-status/${courierId}`, statusData),
  
  // FUNCTION 1: Get courier status (MUST use database function)
  getCourierStatus: (courierId) => api.get(`/couriers/status/${courierId}`),
  
  // TRIGGER VALIDATION: Get logs (proves trigger fired)
  getCourierLogs: (courierId) => api.get(`/couriers/${courierId}/logs`),
  
  // DELETE: Delete courier
  deleteCourier: (courierId) => api.delete(`/couriers/${courierId}`),
  
  // Helper endpoints
  getUsers: () => api.get('/couriers/data/users'),
  getAdmins: () => api.get('/couriers/data/admins'),
  
  // Create new user/admin
  createUser: (userData) => api.post('/reports/users', userData),
  createAdmin: (adminData) => api.post('/reports/admins', adminData),
};

// Reports API calls
export const reportsAPI = {
  // Complex Query 1: JOIN
  getJoinReport: () => api.get('/reports/join'),
  
  // Complex Query 2: NESTED
  getNestedReport: () => api.get('/reports/nested'),
  
  // Complex Query 3: AGGREGATE
  getAggregateReport: () => api.get('/reports/aggregate'),
  
  // Bonus reports
  getAdminPerformance: () => api.get('/reports/admin-performance'),
  getCustomerActivity: () => api.get('/reports/customer-activity'),
};

export default api;
