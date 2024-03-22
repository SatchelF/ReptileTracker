import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useApi } from "../utils/use_api";

export const Home = () => {
  const token = window.localStorage.getItem("jwt");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const api = useApi();
  async function getUser() {
    try{
      const body = await api.get("/users/me");
      setUser(body.user);
    }
    catch (error) {
      console.error(error)
      navigate("/login")
    }
  }

  useEffect(() => {
    if (token) {
      api.refreshToken();
      getUser();
    }
  }, [])

  return (
    <>
      <div>
        <h1>I am on the home page!</h1>
        {token ? (
          <>
            <div>{user && <h1>Welcome, {user.firstName}</h1>}</div>
            <div><Link to="/dashboard">Dashboard</Link> </div>
          </>
        ) : (
          <>
            <div>
              <Link to="/login">Login</Link>
            </div>
            <div>
              <Link to="/sign_up">Sign Up</Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}