import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../../context/AuthProvider";   // <- adjust path if needed
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);           // will be a no‑op if provider missing
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      /* authService should return { token, user, message } */
      const { token, user, message } = await loginUser(email, password);

      /* 1. persist token + user */
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      /* 2. update context so the rest of the app re‑renders instantly */
      setAuth?.({ token, user });

      /* 3. go to the homepage (or wherever) */
      navigate("/");

      /* 4. optional toast */
      setMessage(message ?? "Logged in!");
    } catch (error) {
      const errMsg =
        error?.response?.data?.message ?? error.message ?? "Something went wrong.";
      setMessage(errMsg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {message && <p className="login-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
