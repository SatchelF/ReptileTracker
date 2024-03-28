import { Link, Outlet, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useApi } from "../utils/use_api";
import { Navbar, Nav, Container, Button } from 'react-bootstrap';



function App() {
  const api = useApi();
  const navigate = useNavigate();

  const logout = () => {
    window.localStorage.removeItem("jwt");
    api.refreshToken();
    navigate("/login");
  };

  return (
    <>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Reptile Tracker</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            { api.token &&
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            </Nav>}
            <Nav>
              {api.token ? (
                <Nav.Item>
                  <Button variant="outline-danger" onClick={logout}>Logout</Button>
                </Nav.Item>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  )
}

export default App
