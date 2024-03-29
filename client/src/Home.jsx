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
        {!token && (
          <>
            <div className="container my-5">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="text-center p-4 border shadow rounded bg-dark">
                  <h1 className="display-4 fw-bold">Welcome to Reptile Tracker!</h1>
                  <p className="lead">The modern solution for herpetoculturists. Effortlessly manage, track, and optimize the care of your reptiles with our digital platform, designed to replace outdated pen-and-paper methods. Start enhancing your reptile care experience today!</p>
      </div>
    </div>
  </div>
</div>

          </>
        )}
      </div>
    </>
  );
};
