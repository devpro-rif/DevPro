import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentPage from "./pages/PaymentPage";
import Login from "./components/login/Login";
import Register from "./components/login/Register";
import HomePage from "./pages/HomePage";
import CommunityDetailPage from "./pages/CommunityDetailPage";
import "./components/homePage/styles.css";
const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/community/:id" element={<CommunityDetailPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
