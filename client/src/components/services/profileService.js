// src/services/userService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Update username
export const updateUsername = async (newUsername) => {
  const response = await axios.put(
    `${API_URL}/users/update-username`,
    { newUsername },
    { withCredentials: true }
  );
  return response.data;
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
  const response = await axios.put(
    `${API_URL}/users/update-password`,
    { currentPassword, newPassword },
    { withCredentials: true }
  );
  return response.data;
};


// Update profile image
export const updateProfileImage = (newImg) => {
  return axios.put(
    `${API_URL}/users/update-profileImmage`,
    { newImg },
    { withCredentials: true }
  );
};
