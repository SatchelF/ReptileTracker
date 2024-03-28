import { useState, useEffect } from "react";
import { useApi } from "../utils/use_api";
import { useParams } from "react-router-dom";
import { EditReptileModal } from "./components/EditReptileModal/EditReptileModal";
import { AddFeedingModal } from "./components/AddFeedingModal/AddFeedingModal";
import "./Reptile.css";
import { AddHusbandryRecordModal } from "./components/AddHusbandryRecordModal/AddHusbandryRecordModal";

export const Reptile = () => {
  const { reptileId } = useParams(); // Assuming you're using react-router and reptileId is in the URL
  const api = useApi();

  const [reptile, setReptile] = useState(null);
  const [isUpdatingReptile, setIsUpdatingReptile] = useState(false);

  const [feedings, setFeedings] = useState([]);
  const [isCreatingFeeding, setIsCreatingFeeding] = useState(false);

  const [husbandryRecords, setHusbandryRecords] = useState([]);
  const [isCreatingHusbandryRecord, setIsCreatingHusbandryRecord] =
    useState(false);
  // const [newLength, setNewLength] = useState(0);
  // const [newWeight, setNewWeight] = useState(0);
  // const [newTemperature, setNewTemperature] = useState(0);
  // const [newHumidity, setNewHumidity] = useState(0);

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

  // const handleCreateHusbandryRecord = async (e) => {
  //   e.preventDefault(); // Prevent default form submission behavior

  //   try {
  //     const husbandryRecordInfo = {
  //       reptileId: reptileId,
  //       length: parseFloat(newLength),
  //       weight: parseFloat(newWeight),
  //       temperature: parseFloat(newTemperature),
  //       humidity: parseFloat(newHumidity),
  //     };
  //     const res = await api.post(`/husbandry-records`, husbandryRecordInfo);
  //     setIsCreatingHusbandryRecord(false); // Close the form
  //     setNewLength(0); // Reset the form fields
  //     setNewWeight(0);
  //     setNewTemperature(0);
  //     setNewHumidity(0);
  //     // Optionally, fetch the updated list of feedings here to reflect the new addition
  //     if (res.husbandryRecord) {
  //       setHusbandryRecords((prev) => [...prev, res.husbandryRecord]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to create new feeding:", error);
  //   }
  // };

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

  return (
    <>
      <div className="reptile-container">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <h1>Reptile Details</h1>
              {/* Edit Reptile Details Button */}
              <button
                onClick={() => setIsUpdatingReptile(true)}
                className="btn btn-primary mb-3"
              >
                Edit Reptile Details
              </button>
              {/* Display reptile details */}
              {reptile && (
                <div>
                  <p>Name: {reptile.name}</p>
                  <p>Sex: {reptile.sex}</p>
                  <p>Species: {reptile.species}</p>
                  {/* Add more reptile details as needed */}
                </div>
              )}

              {/* Update Reptile Details Form */}
              <EditReptileModal
                show={isUpdatingReptile}
                onHide={() => setIsUpdatingReptile(false)}
                reptile={reptile}
                setReptile={setReptile}
              />
            </div>
            <div className="col-md-3">
              <h2>Feedings</h2>
              <AddFeedingModal
                show={isCreatingFeeding}
                onHide={() => setIsCreatingFeeding(false)}
                setFeedings={setFeedings}
              />
              <button
                onClick={() => setIsCreatingFeeding(true)}
                className="btn btn-primary"
              >
                Add New Feeding
              </button>

              <ul>
                {feedings &&
                  feedings.map((feeding) => (
                    <li key={feeding.id}>
                      Food: {feeding.foodItem} - Date: {feeding.createdAt}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-3">
              <h2>Husbandry Records</h2>
              <AddHusbandryRecordModal show={isCreatingHusbandryRecord} onHide={() => setIsCreatingHusbandryRecord(false)} setHusbandryRecords={setHusbandryRecords}/>
                <button
                  onClick={() => setIsCreatingHusbandryRecord(true)}
                  className="btn btn-primary"
                >
                  Add New Husbandry Record
                </button>
              <ul>
                {husbandryRecords &&
                  husbandryRecords.map((record) => (
                    <li key={record.id}>
                      Length: {record.length} - Weight: {record.weight} - Temp:{" "}
                      {record.temperature} - Humidity: {record.humidity}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-md-3">
              <h2>Schedules</h2>
              {isCreatingSchedule ? (
                <form onSubmit={handleCreateSchedule} className="mt-3">
                  <h3>Create New Schedule</h3>
                  <div className="mb-3">
                    <label htmlFor="scheduleType" className="form-label">
                      Type:
                    </label>
                    <select
                      id="scheduleType"
                      className="form-select"
                      value={newScheduleType}
                      onChange={(e) => setNewScheduleType(e.target.value)}
                    >
                      <option value="feed">Feed</option>
                      <option value="record">Record</option>
                      <option value="clean">Clean</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description:
                    </label>
                    <input
                      id="description"
                      type="text"
                      className="form-control"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                    />
                  </div>
                  <fieldset className="mb-3">
                    <legend className="form-label">Days:</legend>
                    {Object.keys(days).map((day) => (
                      <div key={day} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`day-${day}`}
                          checked={days[day]}
                          onChange={() =>
                            setDays({ ...days, [day]: !days[day] })
                          }
                        />
                        <label
                          htmlFor={`day-${day}`}
                          className="form-check-label"
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </label>
                      </div>
                    ))}
                  </fieldset>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <button type="submit" className="btn btn-primary me-2">
                      Add Schedule
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsCreatingSchedule(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreatingSchedule(true)}
                  className="btn btn-primary"
                >
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
                      .map(
                        ([key]) => key.charAt(0).toUpperCase() + key.slice(1)
                      ) // Capitalize the first letter of each day
                      .join(", ");

                    return (
                      <li key={schedule.id}>
                        Type: {schedule.type} - Description:{" "}
                        {schedule.description} - Days: {activeDays}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
