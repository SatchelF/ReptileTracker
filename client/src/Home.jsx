import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/use_api";
import "./Home.css";

export const Home = () => {
  const token = window.localStorage.getItem("jwt");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const api = useApi();
  async function getUser() {
    try {
      const body = await api.get("/users/me");
      setUser(body.user);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      navigate("/login");
    }
  }

  useEffect(() => {
    if (token) {
      api.refreshToken();
      getUser();
    }
  }, []);

  return (
    <>
      <div className="home-container">
        {token && (
          <>
            <h1>Welcome!</h1>
            <p>Description of what the app does</p>
          </>
        )}
      </div>
    </>
  );
};
