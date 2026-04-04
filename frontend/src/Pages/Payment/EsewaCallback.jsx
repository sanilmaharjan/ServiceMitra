// Pages/Payment/EsewaCallback.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';

export default function EsewaCallback() {
  const [searchParams] = useSearchParams();
  const { paymentType } = useParams();
  const [status, setStatus] = useState('processing');
  
  const refId = searchParams.get('refId');
  
  useEffect(() => {
    if (refId) {
      setStatus('success');
      setTimeout(() => {
        window.location.href = '/client/jobs';
      }, 3000);
    } else {
      setStatus('failed');
    }
  }, [refId]);
  
  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: 'green' }}>✅ Payment Successful!</h1>
        <p>{paymentType === 'advance' ? '20% advance' : '80% final'} payment completed.</p>
        <p>Transaction ID: {refId}</p>
        <p>Redirecting to dashboard...</p>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ color: 'red' }}>❌ Payment Failed</h1>
        <p>Please try again.</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f4a261',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>⏳ Processing Payment...</h1>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
}