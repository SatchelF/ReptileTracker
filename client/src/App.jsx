import { Outlet } from "react-router-dom";
function App() {

  return (
    <div>
      <nav className="my-nav"><h2>Reptile Tracker</h2></nav>
      <Outlet />
    </div>
  )
}

export default App
