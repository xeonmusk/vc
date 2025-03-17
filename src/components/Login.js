const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    // Handle successful login
  } catch (error) {
    if (error.response) {
      // Server returned an error response
      setError(error.response.data.message || 'Login failed');
    } else if (error.request) {
      // Request was made but no response received
      setError('Cannot connect to server. Please try again later.');
    } else {
      // Error setting up the request
      setError('An error occurred. Please try again.');
    }
    console.error('Login error:', error);
  }
};
