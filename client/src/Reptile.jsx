import { useState, useEffect } from "react";
import { useApi } from "../utils/use_api";
import { useParams } from "react-router-dom";

export const Reptile = () => {
  const { reptileId } = useParams(); // Assuming you're using react-router and reptileId is in the URL
  const api = useApi();

  const [reptile, setReptile] = useState(null);
  const [isUpdatingReptile, setIsUpdatingReptile] = useState(false);
  const [updateReptileName, setUpdateReptileName] = useState("");
  const [updateReptileSpecies, setUpdateReptileSpecies] = useState("");
  const [updateReptileSex, setUpdateReptileSex] = useState("");

  const [feedings, setFeedings] = useState([]);
  const [isCreatingFeeding, setIsCreatingFeeding] = useState(false);
  const [newFeedingFoodItem, setNewFeedingFoodItem] = useState("");
  const [newFeedingDate, setNewFeedingDate] = useState("");

  const [husbandryRecords, setHusbandryRecords] = useState([]);
  const [isCreatingHusbandryRecord, setIsCreatingHusbandryRecord] =
    useState(false);
  const [newLength, setNewLength] = useState(0);
  const [newWeight, setNewWeight] = useState(0);
  const [newTemperature, setNewTemperature] = useState(0);
  const [newHumidity, setNewHumidity] = useState(0);

  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [newScheduleType, setNewScheduleType] = useState("feed");
  const [newDescription, setNewDescription] = useState("");
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  // Fetch reptile details and related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const reptileData = await api.get(`/reptiles/${reptileId}`);
        setReptile(reptileData.reptile);

        if (reptileData.reptile) {
          setUpdateReptileName(reptileData.reptile.name);
          setUpdateReptileSpecies(reptileData.reptile.species);
          setUpdateReptileSex(reptileData.reptile.sex);
        }

        const feedingData = await api.get(`/feedings/${reptileId}`);
        setFeedings(feedingData.feedings);

        const husbandryData = await api.get(`/husbandry-records/${reptileId}`);
        setHusbandryRecords(husbandryData.husbandryRecords);

        const scheduleData = await api.get(`/schedules/reptile/${reptileId}`);
        setSchedules(scheduleData.schedules);
      } catch (error) {
        console.error("Failed to fetch reptile data:", error);
      }
    };

    fetchData();
  }, [api, reptileId]);

  // Handlers for creating new records
  const handleCreateFeeding = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const feedingInfo = {
        reptileId: reptileId, // Ensure this is passed correctly to your API
        foodItem: newFeedingFoodItem,
        date: newFeedingDate,
      };
      const res = await api.post(`/feedings`, feedingInfo);
      setIsCreatingFeeding(false); // Close the form
      setNewFeedingFoodItem(""); // Reset the form fields
      setNewFeedingDate("");
      // Optionally, fetch the updated list of feedings here to reflect the new addition
      if (res.feeding) {
        setFeedings((prev) => [...prev, res.feeding]);
      }
    } catch (error) {
      console.error("Failed to create new feeding:", error);
    }
  };

  const handleCreateHusbandryRecord = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const husbandryRecordInfo = {
        reptileId: reptileId,
        length: parseFloat(newLength),
        weight: parseFloat(newWeight),
        temperature: parseFloat(newTemperature),
        humidity: parseFloat(newHumidity),
      };
      const res = await api.post(`/husbandry-records`, husbandryRecordInfo);
      setIsCreatingHusbandryRecord(false); // Close the form
      setNewLength(0); // Reset the form fields
      setNewWeight(0);
      setNewTemperature(0);
      setNewHumidity(0);
      // Optionally, fetch the updated list of feedings here to reflect the new addition
      if (res.husbandryRecord) {
        setHusbandryRecords((prev) => [...prev, res.husbandryRecord]);
      }
    } catch (error) {
      console.error("Failed to create new feeding:", error);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    try {
      const scheduleData = {
        reptileId: parseInt(reptileId, 10), // Assuming reptileId comes from useParams and is a string
        type: newScheduleType,
        description: newDescription,
        ...days,
      };
      const res = await api.post(`/schedules`, scheduleData);
      // Reset form state
      setIsCreatingSchedule(false);
      setNewScheduleType("feed");
      setNewDescription("");
      setDays({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      });
      if (res.schedule) {
        setSchedules((prev) => [...prev, res.schedule]);
      }
    } catch (error) {
      console.error("Failed to create new schedule:", error);
    }
  };

  // Handler for updating the reptile
  const handleUpdateReptile = async (e) => {
    e.preventDefault();
    try {
      const updatedReptile = {
        name: updateReptileName,
        species: updateReptileSpecies,
        sex: updateReptileSex,
      };
      const res = await api.put(`/reptiles/${reptileId}`, updatedReptile);
      setIsUpdatingReptile(false);
      if (res.reptile) {
        setReptile(res.reptile);
      }
    } catch (error) {
      console.error("Failed to update reptile:", error);
    }
  };

  // Example of how to use createFeeding, createHusbandryRecord, createSchedule, and updateReptile omitted for brevity
  // You'd typically have form inputs for creating these records and updating the reptile, which would call these functions

  return (
    <>
      <h1>Reptile Details</h1>
      {/* Display reptile details */}
      {reptile && (
        <div>
          <p>Name: {reptile.name}</p>
          <p>Sex: {reptile.sex}</p>
          <p>Species: {reptile.species}</p>
          {/* Add more reptile details as needed */}
        </div>
      )}

      {isUpdatingReptile ? (
        <form onSubmit={handleUpdateReptile}>
          <h3>Update Reptile Details</h3>
          <div>
            <label htmlFor="updateName">Name:</label>
            <input
              id="updateName"
              type="text"
              value={updateReptileName}
              onChange={(e) => setUpdateReptileName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="updateSpecies">Species:</label>
            <select
              id="updateSpecies"
              value={updateReptileSpecies}
              onChange={(e) => setUpdateReptileSpecies(e.target.value)}
            >
              {/* Assuming ReptileSpecies enum values are 'ball_python', 'king_snake', 'corn_snake', 'redtail_boa' */}
              <option value="ball_python">Ball Python</option>
              <option value="king_snake">King Snake</option>
              <option value="corn_snake">Corn Snake</option>
              <option value="redtail_boa">Redtail Boa</option>
            </select>
          </div>
          <div>
            <label htmlFor="updateSex">Sex:</label>
            <select
              id="updateSex"
              value={updateReptileSex}
              onChange={(e) => setUpdateReptileSex(e.target.value)}
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
            </select>
          </div>
          <button type="submit">Update Reptile</button>
          <button type="button" onClick={() => setIsUpdatingReptile(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsUpdatingReptile(true)}>
          Edit Reptile Details
        </button>
      )}

      <h2>Feedings</h2>
      {isCreatingFeeding ? (
        <form onSubmit={handleCreateFeeding}>
          <div>
            <label htmlFor="foodItem">Food Item:</label>
            <input
              id="foodItem"
              type="text"
              value={newFeedingFoodItem}
              onChange={(e) => setNewFeedingFoodItem(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="feedingDate">Feeding Date:</label>
            <input
              id="feedingDate"
              type="date"
              value={newFeedingDate}
              onChange={(e) => setNewFeedingDate(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setIsCreatingFeeding(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsCreatingFeeding(true)}>
          Add New Feeding
        </button>
      )}

      <ul>
        {feedings &&
          feedings.map((feeding) => (
            <li key={feeding.id}>
              Food: {feeding.foodItem} - Date: {feeding.createdAt}
            </li>
          ))}
      </ul>

      <h2>Husbandry Records</h2>
      {isCreatingHusbandryRecord ? (
        <form onSubmit={handleCreateHusbandryRecord}>
          <h3>Create New Husbandry Record</h3>
          <div>
            <label htmlFor="length">Length:</label>
            <input
              id="length"
              type="number"
              step="0.01"
              value={newLength}
              onChange={(e) => setNewLength(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="weight">Weight:</label>
            <input
              id="weight"
              type="number"
              step="0.01"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="temperature">Temperature:</label>
            <input
              id="temperature"
              type="number"
              step="0.01"
              value={newTemperature}
              onChange={(e) => setNewTemperature(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="humidity">Humidity:</label>
            <input
              id="humidity"
              type="number"
              step="0.01"
              value={newHumidity}
              onChange={(e) => setNewHumidity(e.target.value)}
            />
          </div>
          <button type="submit">Add Record</button>
          <button
            type="button"
            onClick={() => setIsCreatingHusbandryRecord(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsCreatingHusbandryRecord(true)}>
          Add New Husbandry Record
        </button>
      )}
      <ul>
        {husbandryRecords &&
          husbandryRecords.map((record) => (
            <li key={record.id}>
              Length: {record.length} - Weight: {record.weight} - Temp:{" "}
              {record.temperature} - Humidity: {record.humidity}
            </li>
          ))}
      </ul>

      <h2>Schedules</h2>
      {isCreatingSchedule ? (
        <form onSubmit={handleCreateSchedule}>
          <h3>Create New Schedule</h3>
          {/* Form fields for schedule type, description, days, etc. */}
          <div>
            <label htmlFor="scheduleType">Type:</label>
            <select
              id="scheduleType"
              value={newScheduleType}
              onChange={(e) => setNewScheduleType(e.target.value)}
            >
              <option value="feed">Feed</option>
              <option value="record">Record</option>
              <option value="clean">Clean</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              id="description"
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          {/* Checkbox inputs for days */}
          <div>
            {Object.keys(days).map((day) => (
              <div key={day}>
                <label>
                  <input
                    type="checkbox"
                    checked={days[day]}
                    onChange={() => setDays({ ...days, [day]: !days[day] })}
                  />
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              </div>
            ))}
          </div>
          <button type="submit">Add Schedule</button>
          <button type="button" onClick={() => setIsCreatingSchedule(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsCreatingSchedule(true)}>
          Add New Schedule
        </button>
      )}
      <ul>
        {schedules &&
          schedules.map((schedule) => {
            // Extracting only the days that are true and joining them into a string
            const activeDays = Object.entries(schedule)
              .filter(
                ([key, value]) =>
                  value === true &&
                  [
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].includes(key)
              )
              .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)) // Capitalize the first letter of each day
              .join(", ");

            return (
              <li key={schedule.id}>
                Type: {schedule.type} - Description: {schedule.description} -
                Days: {activeDays}
              </li>
            );
          })}
      </ul>
    </>
  );
};
