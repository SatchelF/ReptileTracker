import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/use_api";

export const Dashboard = () => {
  const [schedules, setSchedules] = useState([]);
  const [reptiles, setReptiles] = useState([]);
  const [isCreatingReptile, setIsCreatingReptile] = useState(false);
  const [newReptileName, setNewReptileName] = useState("");
  const [newReptileSex, setNewReptileSex] = useState("m"); // default to 'm'
  const [newReptileSpecies, setNewReptileSpecies] = useState("ball_python"); // default to 'ball_python'
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

  const handleCreateReptile = async () => {
    const res = await api.post("/reptiles", {
      name: newReptileName,
      sex: newReptileSex,
      species: newReptileSpecies,
    });
    // Reset the form fields and possibly fetch the updated list of reptiles here
    setNewReptileName("");
    setNewReptileSex("m"); // Reset to default or as per your logic
    setNewReptileSpecies("ball_python"); // Reset to default or as per your logic
    setIsCreatingReptile(false); // Close the form

    if (res.reptile)
    {
        setReptiles((prev) => [...prev, res.reptile]);
    }

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
    <>
      <h2>Today's Schedules</h2>
      <ul>
        {schedules &&
          schedules.map((schedule) => (
            <li key={schedule.id}>
              {schedule.description} - {schedule.type}
            </li>
          ))}
      </ul>

      <h2>My Reptiles</h2>
      <ul>
        {reptiles &&
          reptiles.map((reptile) => (
            <li key={reptile.id}>
              {reptile.name} -{" "}
              <button onClick={() => handleReptileSelect(reptile.id)}>
                View
              </button>
              <button onClick={() => handleDeleteReptile(reptile.id)}>
                Delete
              </button>
            </li>
          ))}
      </ul>
      {isCreatingReptile ? (
        <div>
          <input
            type="text"
            placeholder="Reptile Name"
            value={newReptileName}
            onChange={(e) => setNewReptileName(e.target.value)}
          />
          <select
            value={newReptileSex}
            onChange={(e) => setNewReptileSex(e.target.value)}
          >
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
          <select
            value={newReptileSpecies}
            onChange={(e) => setNewReptileSpecies(e.target.value)}
          >
            <option value="ball_python">Ball Python</option>
            <option value="king_snake">King Snake</option>
            <option value="corn_snake">Corn Snake</option>
            <option value="redtail_boa">Redtail Boa</option>
          </select>
          <button onClick={handleCreateReptile}>Create Reptile</button>
        </div>
      ) : (
        <button onClick={() => setIsCreatingReptile(true)}>
          Add New Reptile
        </button>
      )}
      <button onClick={logout}>Logout</button>
    </>
  );
};
