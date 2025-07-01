import React, { useState, useEffect } from 'react';
import { updateUsername, updatePassword, updateProfileImage } from '../services/profileService';
import './EditUser.css';

function EditUser() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUsername(storedUser.username);
      setProfileImage(storedUser.profileImage);
    }
  }, []);

    useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer); 
    }
  }, [message]);

  const handleUsernameUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = await updateUsername(username);

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      storedUser.username = data.username;
      localStorage.setItem("user", JSON.stringify(storedUser));

      setMessage("Username updated successfully.");
    } catch (error) {
      console.error("Error updating username:", error);
      setMessage(error.response?.data?.message || "Failed to update username.");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(currentPassword, newPassword);
      setMessage("Password updated successfully.");
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage(error.response?.data?.message || "Failed to update password.");
    }
  };


    const handleImageUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfileImage(profileImage);
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      updatedUser.profileImage = response.data.profileImage;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setMessage("Profile image updated successfully.");
    } catch (error) {
      console.error("Error updating image:", error);
      setMessage(error.response?.data?.message || "Failed to update profile image.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Edit Profile</h2>
        {message && <p>{message}</p>}

        <form onSubmit={handleUsernameUpdate}>
          <div className="input-group">
            <label>Username:</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <button className="login-button" type="submit">Update Username</button>
        </form>

        <form onSubmit={handlePasswordUpdate}>
          <div className="input-group">
            <label>Current Password:</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="input-group">
            <label>New Password:</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button className="login-button" type="submit">Update Password</button>
        </form>

        <form onSubmit={handleImageUpdate}>
          <div className="input-group">
            <label>Profile Image URL:</label>
            <input value={profileImage} onChange={(e) => setProfileImage(e.target.value)} />
          </div>
          <button className="login-button" type="submit">Update Image</button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <img src={profileImage} alt="Profile Preview" width="120" />
        </div>
      </div>
    </div>
  );
}

export default EditUser;
