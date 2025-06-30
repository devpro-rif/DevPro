import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import CampaignPage from './pages/CampaignPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/campaigns" element={<CampaignPage />} />
    </Routes>
  </Router>
);

export default App;
