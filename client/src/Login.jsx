import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/use_api";
import './Login.css';

export const Login = () => {
  const passwordInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const api = useApi();

  async function login(e) {
    e.preventDefault();
    try {
      const res = await api.post("/sessions", {
        email,
        password,
      });
      if (res.token) {
        window.localStorage.setItem("jwt", res.token);
        navigate("/");
      } else {
        const errorMessage = "Login failed. Please check your credentials and try again.";
        if (passwordInputRef.current) {
          passwordInputRef.current.setCustomValidity(errorMessage);
          passwordInputRef.current.reportValidity();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      if (passwordInputRef.current) {
        passwordInputRef.current.setCustomValidity(errorMessage);
        passwordInputRef.current.reportValidity();
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="mb-3">Login</h2>
        <form onSubmit={login}>
          {/* Form groups for email and password */}
          <div className="form-group mb-3">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input
              id="emailInput"
              className="form-control"
              placeholder="Enter your email"
              type="email"
              value={email}
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="passwordInput" className="form-label">Password</label>
            <input
              id="passwordInput"
              className="form-control"
              placeholder="Enter your password"
              type="password"
              value={password}
              required
              onChange={e => setPassword(e.target.value)}
              ref={passwordInputRef}
            />
          </div>
            <button type="submit" className="btn btn-primary btn-lg">Sign In</button> 
        </form>
      </div>
    </div>
  );
};