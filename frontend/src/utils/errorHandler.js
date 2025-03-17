import { toast } from 'react-toastify';

export const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'An error occurred';
  
  // Log error for debugging
  console.error('Error:', error);

  // Show user-friendly message
  toast.error(message);

  // Handle specific error codes
  switch (error.response?.status) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      // Handle forbidden access
      toast.error('You do not have permission to perform this action');
      break;
    case 404:
      // Handle not found
      toast.error('Resource not found');
      break;
    default:
      // Handle other errors
      break;
  }

  return Promise.reject(error);
};

export const setupAxiosInterceptors = (axios) => {
  axios.interceptors.response.use(
    response => response,
    error => handleError(error)
  );
};
