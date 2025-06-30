import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/users`;

//login service
export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};


//register service
export const registerUser = async ({ username, email, password, profileImage }) => {
  const response = await axios.post(
    `${API_URL}/register`,
    { username, email, password, profileImage }
  );
  return response.data;
};