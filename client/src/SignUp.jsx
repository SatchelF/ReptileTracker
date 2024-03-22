import { useRef, useState } from "react";
import { useApi } from "../utils/use_api";
import { useNavigate } from "react-router-dom";

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
    <>
      <h2>Sign Up</h2>
      <form className="sign-up-form" onSubmit={createUser}>
        <input
          placeholder="First name"
          type="text"
          value={firstName}
          required
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Last name"
          type="text"
          value={lastName}
          required
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailInputRef.current) {
              emailInputRef.current.setCustomValidity("");
            }
          }}
          ref={emailInputRef}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
            if (emailInputRef.current) {
              emailInputRef.current.setCustomValidity("");
            }
          }}
        />

        <button>Create Account</button>
      </form>
    </>
  );
};
