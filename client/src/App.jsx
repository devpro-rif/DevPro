import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import CampaignPage from './pages/CampaignPage';
import Login from './components/login/Login';
import Register from './components/login/Register';
import EditUser from './components/userProfile/EditUser';

const App = () => (
  <Router>
    <Routes>
      <Route path="/campaigns" element={<CampaignPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/user/edit" element={<EditUser />} />
    </Routes>
  </Router>
);

export default App;
