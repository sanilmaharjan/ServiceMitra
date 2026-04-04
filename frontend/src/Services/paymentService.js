// services/paymentService.js
const API_BASE = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('access_token');

export const paymentService = {
  // 1. CASH PAYMENT - Direct record
  async cashPayment(jobId, amount, paymentType) {
    const token = getToken();
    const endpoint = paymentType === 'advance' 
      ? `${API_BASE}/payment/advance/${jobId}/`
      : `${API_BASE}/payment/final/${jobId}/`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        payment_method: 'cash',
        amount: amount 
      })
    });
    return response.json();
  },

  // 2. eSEWA PAYMENT - Redirect to eSewa
  async esewaPayment(jobId, amount, paymentType) {
    const token = getToken();
    const endpoint = paymentType === 'advance' 
      ? `${API_BASE}/payment/advance/${jobId}/`
      : `${API_BASE}/payment/final/${jobId}/`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        payment_method: 'esewa',
        amount: amount 
      })
    });
    
    const data = await response.json();
    
    if (data.esewa_data) {
      this.submitToEsewa(data.esewa_data, data.esewa_url);
    }
    return data;
  },

  // Helper: Submit form to eSewa
  submitToEsewa(esewaData, esewaUrl) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = esewaUrl;
    
    Object.keys(esewaData).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = esewaData[key];
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  },

  // Get payment status
  async getPaymentStatus(jobId) {
    const token = getToken();
    const response = await fetch(`${API_BASE}/payment/status/${jobId}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};