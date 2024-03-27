import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/use_api";
import ReptileCard from "./components/ReptileCard/ReptileCard";
import AddReptileModal from "./components/AddReptileModal/AddReptileModal";
import './Dashboard.css'; 


export const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [reptiles, setReptiles] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    // Fetch schedules for today
    const today = new Date()
      .toLocaleDateString("en-us", { weekday: "long" })
      .toLowerCase();
    api.get(`/schedules/${today}`).then((res) => {
      const schedulesArray = Array.isArray(res.schedules) ? res.schedules : [];
      setSchedules(schedulesArray);
    });

    // Fetch all reptiles for the user
    api.get("/reptiles").then((res) => {
      const reptilesArray = Array.isArray(res.reptiles) ? res.reptiles : [];
      setReptiles(reptilesArray);
    });
  }, [api]);

  const handleReptileSelect = (reptileId) => {
    navigate(`/reptiles/${reptileId}`);
  };

  const handleCreateReptile = async ({ name, sex, species }) => {
    const res = await api.post("/reptiles", {
      name: name,
      sex: sex,
      species: species,
    });

    if (res.reptile) {
      setReptiles((prev) => [...prev, res.reptile]);
    }
    setShowModal(false); // Close the modal
  };

  const handleDeleteReptile = async (reptileId) => {
    const res = await api.del(`/reptiles/${reptileId}`);
    console.log("res", res);
    if (res.reptile) {
      setReptiles((prev) => prev.filter((reptile) => reptile.id !== res.reptile.id));
    }
    // // Refresh reptiles list
    // api.get("/reptiles").then(setReptiles);
  };

  const logout = () => {
    window.localStorage.removeItem("jwt");
    api.refreshToken();
    setReptiles([]);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-9">
          <ul>
            {schedules &&
              schedules.map((schedule) => (
                <li key={schedule.id}>
                  {schedule.description} - {schedule.type}
                </li>
              ))}
          </ul>
          <h2 className="mb-5">My Reptiles</h2>
          <div className="row ">
            {reptiles &&
              reptiles.map((reptile) => (
                <ReptileCard
                  key={reptile.id}
                  reptile={reptile}
                  onSelect={handleReptileSelect}
                  onDelete={handleDeleteReptile}
                />
              ))}
          </div>
        </div>
        <div className="col-md-3">
          <h2>Schedule</h2>
          {/* Render your schedule component here */}
        </div>
      </div>
      <button className="btn btn-primary btn-floating add-btn" onClick={() => setShowModal(true)}>+</button>
      <AddReptileModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onCreateReptile={handleCreateReptile} 
      />
      <button className="btn btn-outline-danger logout-btn" onClick={logout}>Logout</button>
    </div>
    </div>
  );
};
