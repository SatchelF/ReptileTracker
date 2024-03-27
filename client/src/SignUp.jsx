import { useRef, useState } from "react";
import { useApi } from "../utils/use_api";
import { useNavigate } from "react-router-dom";
import './SignUp.css';

export const SignUp = () => {
  const emailInputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const api = useApi();

  async function createUser(e) {
    e.preventDefault();
    try {
      const res = await api.post("/users", {
        email,
        password,
        firstName,
        lastName,
      });
      if (res === "Email already in use.")
      {
        errorMessage = "Email already in use. Please try again.";
        emailInputRef.current.setCustomValidity(errorMessage);
        emailInputRef.current.reportValidity();
      }
      else if (res.user && res.token)
      {
        window.localStorage.setItem("jwt", res.token);
        api.refreshToken();
        navigate("/dashboard");
      }
    } catch (error) {
      if (emailInputRef.current) {
        var errorMessage = "";
        console.log(error);
        if (error.status === 409) {
          errorMessage = "Email already in use. Please try again.";
        } else {
          errorMessage = "An unexpected error occurred. Please try again.";
        }
        emailInputRef.current.setCustomValidity(errorMessage);
        emailInputRef.current.reportValidity();
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        <form onSubmit={createUser}>
          {/* FirstName and LastName inputs */}
          <input
            className="form-control"
            placeholder="First name"
            type="text"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Last name"
            type="text"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
          />
          {/* Email and Password inputs */}
          <input
            className="form-control"
            placeholder="Email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
          />
          <input
            className="form-control"
            placeholder="Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Sign Up button */}
          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
      </div>
    </div>
  );
};
