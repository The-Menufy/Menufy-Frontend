import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { authStore } from '../../../store/authStore';
import { apiRequest } from '../../../utils/apiRequest';

const DeviceVerification = () => {
  const [status, setStatus] = useState('verifying');
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyDevice } = authStore(); // Move hook call to component level

  useEffect(() => {
    const verifyDeviceToken = async () => {
      try {
        const response = await apiRequest.get(`/auth/login/verify-device/${token}`);
        console.log(response)
        if (response.data.success) {
          setStatus('success');
          verifyDevice(response.data)
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        setStatus('error');
        console.error('Verification failed:', error || 'Unknown error');
      }
    };
    verifyDeviceToken();
  }, [token, navigate, verifyDevice]);

  return (
    <div className="verification-container">
      {status === 'verifying' && <p>Verifying your device...</p>}
      {status === 'success' && <p>Device verified successfully! Redirecting...</p>}
      {status === 'error' && <p>Verification failed. Please try logging in again.</p>}
    </div>
  );
};

export default DeviceVerification;