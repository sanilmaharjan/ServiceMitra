import React, { useState } from 'react';

export default function TestEsewa() {
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);

  const handleEsewaPayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/payment/initiate-esewa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          amount: amount,
          job_id: 1
        })
      });
      
      const data = await response.json();
      console.log('eSewa data:', data);
      
      if (data.esewa_data) {
        // Create and submit form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.esewa_url;
        
        Object.keys(data.esewa_data).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = data.esewa_data[key];
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
      <h2>Test eSewa Payment</h2>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      />
      <button 
        onClick={handleEsewaPayment}
        disabled={loading}
        style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        {loading ? 'Processing...' : 'Pay with eSewa'}
      </button>
    </div>
  );
}