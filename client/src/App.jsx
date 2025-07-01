import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import CampaignPage from './pages/CampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ContributionForm from './pages/ContributionForm';
import Login from './components/login/Login';
import Register from './components/login/Register';
import NavBar from './components/NavBar';
import ContributionPage from './pages/ContributionPage';

const App = () => (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/campaigns" element={<CampaignPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/campaigns/:id/contribute" element={<ContributionForm />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contributions" element={<ContributionPage />} />
    </Routes>
  </Router>
);

export default App;
