import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const USERS_URL = `${API_URL}/users`;

console.log('API URL:', API_URL);
console.log('Users URL:', USERS_URL);

//login service
export const loginUser = async (email, password) => {
  console.log('Attempting login with:', { email });
  try {
    const response = await axios.post(
      `${USERS_URL}/login`,
      { email, password },
      { withCredentials: true }
    );
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};


//register service
export const registerUser = async ({ username, email, password, profileImage }) => {
  console.log('Attempting registration with:', { username, email });
  try {
    const response = await axios.post(
      `${USERS_URL}/register`,
      { username, email, password, profileImage }
    );
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};