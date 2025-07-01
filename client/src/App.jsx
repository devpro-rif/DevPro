import React from 'react';
import { Routes, Route } from 'react-router-dom'; // remove BrowserRouter from here
import PaymentPage from './pages/PaymentPage';
import CampaignPage from './pages/CampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ContributionForm from './pages/ContributionForm';
import Login from './components/login/Login';
import Register from './components/login/Register';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Sidebar from './components/homePage/SideBar';

const App = () => (
  <>
  {/* // <div className="app-shell">
  //   <Sidebar />
  //   <div className="main-area"> */}
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigns" element={<CampaignPage />} />
        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="/campaigns/:id/contribute" element={<ContributionForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  {/* //   </div>
  // </div> */}
  </>
);

export default App;
