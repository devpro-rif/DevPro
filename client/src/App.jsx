import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/payment" element={<PaymentPage />} />
  
    </Routes>
  </Router>
);

export default App;
