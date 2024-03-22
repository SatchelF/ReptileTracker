import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/use_api";

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
        const errorMessage =
          "Login failed. Please check your credentials and try again.";
        // Set custom validity message
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
    <>
      <h2>Login</h2>
      <form className="sign-up-form" onSubmit={login}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear any custom validity message when the user starts editing
            if (passwordInputRef.current) {
              passwordInputRef.current.setCustomValidity("");
            }
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordInputRef.current) {
              passwordInputRef.current.setCustomValidity("");
            }
          }}
          ref={passwordInputRef}
        />

        <button>Sign In</button>
      </form>
    </>
  );
};
