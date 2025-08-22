import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../App';
import { CheckCircle, AlertCircle } from 'lucide-react';

const OAuthSuccessPage = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (error) {
        // Handle OAuth error
        setTimeout(() => {
          navigate('/login?error=oauth_failed');
        }, 2000);
        return;
      }

      if (token) {
        try {
          // Store token
          localStorage.setItem('token', token);
          
          // Fetch user data
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data.user);
            navigate('/');
          } else {
            throw new Error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('OAuth success error:', error);
          localStorage.removeItem('token');
          navigate('/login?error=oauth_failed');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };

    handleOAuthCallback();
  }, [token, error, navigate, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Failed</h2>
          <p className="text-gray-600 mb-6">
            There was an error with your OAuth authentication. Please try again.
          </p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Successful!</h2>
        <p className="text-gray-600 mb-6">
          You have been successfully authenticated. Setting up your account...
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccessPage;
