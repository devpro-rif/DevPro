import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PaymentPage from './pages/PaymentPage';
import CampaignPage from './pages/CampaignPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ContributionForm from './pages/ContributionForm';
import Login from './components/login/Login';
import Register from './components/login/Register';
import EditUser from './components/userProfile/EditUser';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute'; 
import NotFound from './components/NotFound';
import HomePage from './pages/HomePage';


const App = () => (
  <Router>
    <NavBar />
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
         path="/" 
         element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
         
         } />
      <Route
        path="/campaigns"
        element={
          <PrivateRoute>
            <CampaignPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/campaigns/:id"
        element={
          <PrivateRoute>
            <CampaignDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/campaigns/:id/contribute"
        element={
          <PrivateRoute>
            <ContributionForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/edit"
        element={
          <PrivateRoute>
            <EditUser />
          </PrivateRoute>
        }
      />
      

       
        {/*catch unfound routes*/}
    <Route path="*" element={<NotFound />} />
    </Routes>

  
  </Router>
);

export default App;
