import { Outlet } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  return (
    <div>
      <nav className="my-nav"><h2>Reptile Tracker</h2></nav>
      <Outlet />
    </div>
  )
}

export default App
